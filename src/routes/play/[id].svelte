<script context="module" lang="ts">
  export const prerender = true;
</script>

<script lang="ts">
  import type { IPlay, ISpeech } from '$lib/types';
  import { longpress } from '$lib/longpress.js';
  import VirtualList from 'svelte-virtual-list-ce';
  import { onMount } from 'svelte';
  import http from '$lib/http';
  import MediaControl from '$lib/MediaControl.svelte';
  import Loader from '../../lib/Loader.svelte';
  import Modal from '../../lib/Modal.svelte';
  import Icon from '../../lib/icon/Icon.svelte';

  export let play: IPlay;
  export let speeches: ISpeech[] = [];
  let selectedItem: ISpeech;
  let editedItem: ISpeech;
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
      http.put(`/speeches/${data.id}.json`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', }
      }).then(({ data }) => {
        speeches = speeches.map((s) => s.id === data.id ? data : s);
        selectedItem = data;
      });
    } else {
      http.put(`/speeches/${data.id}.json`, data)
        .then(({ data }) => {
          speeches = speeches.map((s) => s.id === data.id ? data : s);
          selectedItem = data;
        });
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

  const goto = (item) => {
    scrollToIndex(speeches.findIndex((s) => s.id === item.id));
    selectedItem = item;
  };
  const close = () => editedItem = null;
  const save = () => {
    handleUpdate({ id: editedItem.id, text: editedItem.text });
    editedItem = null;
  };

  const handleDelete = (item) => {
    http.delete(`/speeches/${item.id}.json`)
      .then(() => {
        speeches = speeches.filter((i) => i.id !== item.id);
        editedItem = null;
      });
  };

  $: currentIndex = speeches.findIndex((s) => s.id === selectedItem?.id);
  $: prevSpeechItem = speeches.slice(0, currentIndex - 1).reverse().find((s) => s.audio_url);
  $: nextSpeechItem = speeches.slice(currentIndex + 1).find((s) => s.audio_url);
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
  {#if speeches.length > 0}
    <VirtualList items={speeches} let:item bind:scrollToIndex>
      <div
        class="speech-item"
        class:selected={selectedItem === item}
        class:matched={item.text.startsWith(selectedRole)}
        class:withAudio={item.audio_url}
        on:click={() => handleClick(item)}
        on:long={() => editedItem = item}
        use:longpress
      >
        <div class="item-actions">
          <Icon name="edit" onClick={() => editedItem = item} />
        </div>
        {@html item.text}
      </div>
    </VirtualList>
  {:else}
    <Loader />
  {/if}
</main>
{#if editedItem}
  <Modal on:close={close}>
    <span slot="header">Редактирование текста</span>
    <p contenteditable="true" bind:innerHTML={editedItem.text} autofocus>
    </p>
    <div class="d-flex justify-content-between" slot="footer">
      <div>
        <button class="btn-secondary" on:click={close}>
          Отменить
        </button>
        <button class="btn-danger" on:click={() => handleDelete(editedItem)}>
          Удалить
        </button>
      </div>

      <button class="btn-primary" on:click={save}>
        Сохранить
      </button>
    </div>
  </Modal>
{/if}
{#if selectedItem}
  {#key selectedItem}
    <footer>
      <div class="container">
        <MediaControl
          audioUrl={selectedItem.audio_url}
          onSave={(audio) => handleUpdate({ id: selectedItem.id, audio })}
          onClickPrev={prevSpeechItem && (() => goto(prevSpeechItem))}
          onClickNext={nextSpeechItem && (() => goto(nextSpeechItem))}
        />
      </div>
    </footer>
  {/key}
{/if}


<style>
  header {
    box-shadow: 0 1px 3px #ccc;
  }

  .speech-item {
    cursor: pointer;
    padding: 1rem;
    transition: all ease-in-out 0.3s;
    border-left: 3px solid white;
    position: relative;
  }

  .item-actions {
    display: none;
    position: absolute;
    top: 4px;
    right: 4px;
    background-color: white;
    border-radius: 8px;
  }

  .item-actions > :global(div) {
    width: 16px;
    margin: 4px;
  }

  .speech-item:hover .item-actions {
    display: block;
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
    border-color: cadetblue !important;
  }

  .speech-item.withAudio {
    border-color: #cccccc;
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

  [contenteditable] {
    padding: 0.5em;
    border: 1px solid #eee;
    border-radius: 4px;
  }
</style>
