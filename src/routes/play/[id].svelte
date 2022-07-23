<script lang="ts">
  import type { IPlay, ISpeech } from '$lib/types';
  import { longpress } from '$lib/longpress.js';
  import VirtualList from 'svelte-virtual-list-ce';
  import { onMount } from 'svelte';
  import http from '$lib/http';
  import MediaControl from '$lib/MediaControl.svelte';

  export let play: IPlay;
  export let speeches: ISpeech[] = [];
  let selectedItem: ISpeech;
  let selectedRole: string;
  let scrollToIndex;

  const key = `speeches-for-${play.id}`;

  onMount(() => {
    const rawData = localStorage.getItem(key);
    speeches = rawData ? JSON.parse(rawData) : [];
    http.get(`/speeches.json?play_id=${play.id}`).then(({ data }) => {
      speeches = data;
      localStorage.setItem(key, JSON.stringify(data));
    });
  });

  const handleUpdate = (data) => {
    if (data.audio) {
      let formData = new FormData();
      formData.append('speech[audio]', data.audio);
      http.put(`/speeches/${data.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', }
      }).then(({ data }) => selectedItem = data);
    } else {
      http.put(`/speeches/${data.id}`, data);
    }
  };
  const handleClick = (item) => {
    selectedItem = selectedItem === item ? null : item;
  };
  const toggleRole = (role) => {
    if (selectedRole === role) {
      selectedRole = null;
    } else {
      selectedRole = role;
      const index = speeches.findIndex((r) => r.text.startsWith(role));
      scrollToIndex(index);
    }
  };
</script>

<svelte:head>
  <title>{play.title}</title>
  <meta name="description" content="A todo list app" />
</svelte:head>

<header>
  <div class="container d-flex align-items-center justify-content-between">
    <a href="/">← Назад</a>
    <h2>{play.title}</h2>
    <div class="burger">
      <svg viewBox="0 0 100 60" width="24" height="24">
        <rect width="100" height="6"></rect>
        <rect y="30" width="100" height="6"></rect>
        <rect y="60" width="100" height="6"></rect>
      </svg>
    </div>
  </div>
</header>

<main class:filtered={selectedRole}>
  <div class="roles">
    {#each play.roles as role (role)}
      <div class="role" class:active={role === selectedRole} on:click={() => toggleRole(role)}>{role}</div>
    {/each}
  </div>
  <VirtualList items={speeches} let:item bind:scrollToIndex>
    <div
      class="speech-item"
      class:selected={selectedItem === item}
      class:matched={item.text.startsWith(selectedRole)}
      on:click={() => handleClick(item)}
      use:longpress
    >
      {item.text}
    </div>
  </VirtualList>
</main>

{#if selectedItem}
  <footer>
    <div class="container">
      <MediaControl selectedSpeech={selectedItem} onSave={(audio) => handleUpdate({ id: selectedItem.id, audio })} />
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

  .filtered .speech-item {
    opacity: 0.4;
  }

  .filtered .speech-item.matched {
    opacity: 1;
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

  .burger {
    cursor: pointer;
  }

  .roles {
    display: flex;
    padding-bottom: 1rem;
    margin-top: 0.5rem;
    overflow-x: auto;
  }
</style>
