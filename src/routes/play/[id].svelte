<script lang="ts">
  import type { IPlay, ISpeech } from '$lib/types';
  import { longpress } from '$lib/longpress.js';
  import VirtualList from '@sveltejs/svelte-virtual-list';
  import { onMount } from 'svelte';
  import http from '$lib/http';

  export let play: IPlay;
  export let speeches: ISpeech[] = [];
  let selectedItem: ISpeech;
  let selectedRole: string;
  const key = `speeches-for-${play.id}`;

  onMount(() => {
    const rawData = localStorage.getItem(key);
    speeches = rawData ? JSON.parse(rawData) : [];
    http.get(`/speeches.json?play_id=${play.id}`).then(({ data }) => {
      speeches = data;
      localStorage.setItem(key, JSON.stringify(data));
    });
  });

  const handleClick = (item) => {
    selectedItem = selectedItem === item ? null : item;
  };
  const toggleRole = (role) => {
    selectedRole = selectedRole === role ? null : role;
  };
</script>

<svelte:head>
  <title>{play.title}</title>
  <meta name="description" content="A todo list app" />
</svelte:head>

<header>
  <div class="container d-flex align-items-center justify-content-between">
    <a href="/">Back</a>
    <h2>{play.title}</h2>
    <div>handler</div>
  </div>
</header>

<main>
  <div class="d-flex mb-3">
    {#each play.roles as role (role)}
      <div class="role" class:active={role === selectedRole} on:click={() => toggleRole(role)}>{role}</div>
    {/each}
  </div>
  <VirtualList items={speeches} let:item>
    <div
      class="speech-item"
      class:selected={selectedItem === item}
      on:click={() => handleClick(item)}
      on:long={(e) => console.log('looong', item)}
      use:longpress
    >
      {item.text}
    </div>
  </VirtualList>
</main>

{#if selectedItem}
  <footer>
    <div class="container">
      this is footer
    </div>
  </footer>
{/if}


<style>
  header {
    box-shadow: 0 1px 3px #ccc;
  }

  .speech-item {
    cursor: pointer;
    padding: 1rem;
    transition: all ease-in-out 0.3s;
  }

  .speech-item:hover {
    background-color: #eeeeee;
  }

  .speech-item.selected {
    border-left: 3px solid cadetblue;
  }

  footer {
    border-top: 1px solid #ccc;
  }

  .role {
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid #cccccc;
    margin-right: 1rem;
  }
  .role.active {
    background-color: cadetblue;
    color: white;
    border-color: cadetblue;
  }
</style>
