<script context="module" lang="ts">
  export const prerender = true;
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import http from '$lib/http';
  import type { IPlay } from '$lib/types';
  import ded from '$lib/icon/ded.svg'

  let plays: IPlay[] = [];
  onMount(() => {
    http.get('/play').then(({ data }) => plays = data);
  });
</script>

<svelte:head>
  <title>А Где Дед?</title>
  <meta name="description" content="ПО для заучивания сценариев" />
</svelte:head>

<section>
  <h1>А Где Дед?</h1>
  <img src={ded} width="100px" alt="Где был дед">

  <h2 class="mb-5">Помощник в заучивании сценариев для спектаклей</h2>

  <ul>
    {#each plays as play (play)}
      <li>
        <a href="/play/{play.id}" sveltekit:prefetch>
          <h3>{play.title}</h3>
          <div><em>{play.description}</em></div>
          <small>{play.roles.length} человек</small>
        </a>
      </li>
    {/each}
  </ul>
  <br><br>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
  }

  h1 {
    width: 100%;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    margin-bottom: 1rem;
    padding: 1rem;
    box-shadow: 0 0 3px var(--primary-color);
    border-radius: 1rem;
    width: 300px;
  }
  h3  {
    margin-top: 0;
    margin-bottom: 1rem;
  }
</style>
