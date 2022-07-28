<script context="module" lang="ts">
  export const prerender = true;
</script>

<script lang="ts">
  import type { IPlay } from '$lib/types';
  import ded from '$lib/icon/ded.svg';

  export let plays: IPlay[];
</script>

<svelte:head>
  <title>А Где Дед?</title>
  <meta name="description" content="ПО для заучивания сценариев" />
</svelte:head>

<section>
  <h1>А Где Дед?</h1>
  <div class="text-center"><img src={ded} width="100px" alt="Где был дед"></div>


  <h2 class="mb-5 p-3 text-center">Помощник в заучивании сценариев для спектаклей</h2>

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
    height: 100vh;
    overflow: auto;
  }

  h1 {
    width: 100%;
    text-align: center;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 1rem;
  }

  li {
    margin-bottom: 1rem;
    padding: 1rem;
    box-shadow: 0 0 3px var(--primary-color);
    border-radius: 1rem;
    width: 100%;
    max-width: 600px;
    box-sizing: border-box;
  }

  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
  }
</style>
