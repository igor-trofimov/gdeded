<script lang="ts">
  import type { ISpeech } from './types';
  import Icon from './icon/Icon.svelte';

  let mediaRecorder;
  let audioBlob;
  let recording = false;
  let audio;
  export let onSave;
  export let selectedSpeech: ISpeech;
  export let onClickPrev
  export let onClickNext
  const play = () => {
    audio.src = selectedSpeech.audio_url || URL.createObjectURL(audioBlob);
    audio.play();
  };
  const stop = () => mediaRecorder.stop();

  const record = () => {
    recording = true;
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        const audioChunks = [];

        mediaRecorder.addEventListener('dataavailable', event => {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener('stop', () => {
          audioBlob = new Blob(audioChunks);
          recording = false;
        });
      });
  };
</script>

<div class="d-flex media-control align-items-center">
  {#if mediaRecorder}
    <Icon onClick={stop} name="stop" title="Остановить" />
  {/if}
  {#if onClickPrev}
    <Icon name="prev" onClick={onClickPrev} title="Предыдущая запись" />
  {/if}
  {#if audioBlob || selectedSpeech.audio_url}
    <Icon name="play" onClick={play} title="Проиграть" />
  {/if}
  {#if onClickNext}
    <Icon name="next" onClick={onClickNext} title="Следующая запись" />
  {/if}
  {#if !mediaRecorder}
    <Icon name="mic" onClick={record} title="Record" />
  {/if}
  {#if audioBlob}
    <Icon name="save" onClick={() => onSave(audioBlob)} title="Сохранить" />
  {/if}
  <audio bind:this={audio} />
</div>

<style>
  .media-control {
    padding: 0.5rem;
    justify-content: center;
  }

  .media-control > :global(div) {
    margin: 0 0.5rem;
  }
</style>
