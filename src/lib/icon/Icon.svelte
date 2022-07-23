<script lang="ts">
  import mic from './mic.svg';
  import next from './next.svg';
  import pause from './pause.svg';
  import play from './play.svg';
  import prev from './prev.svg';
  import save from './save.svg';
  import stop from './stop.svg';

  const icons = {
    mic,
    next,
    pause,
    play,
    prev,
    save,
    stop,
  };

  type iconNames = 'mic' | 'next' | 'pause' | 'play' | 'prev' | 'save' | 'stop'
  export let name: iconNames;
  export let title = '';
  export let onClick;
</script>
<div class="icon" title={title} on:click={onClick}>
  <img src={icons[name]} alt={title} />
</div>

<style>
  .icon {
    display: inline-block;
    width: 24px;
    cursor: pointer;
  }
  img {
    width: 100%;
  }
</style>
