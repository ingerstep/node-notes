<script lang="ts">
  import { getNote, archiveNote, unarchiveNote, deleteNote } from './api'
  import Progress from './Progress.svelte'

  export let params: { id: string }
  export let onNoteClosed: () => void
  export let onNoteArchived: () => void
  export let onNoteDeleted: () => void
  export let onNoteUnarchived: () => void
  export let onNoteEditStarted: () => void

  $: p = getNote(params.id)

  const close = async () => {
    onNoteClosed()
  }

  const doArchive = async () => {
    await archiveNote(params.id)
    onNoteArchived()
  }

  const doDelete = async () => {
    await deleteNote(params.id)
    onNoteDeleted()
  }

  const doUnarchive = async () => {
    await unarchiveNote(params.id)
    onNoteUnarchived()
  }

  const doEdit = () => {
    onNoteEditStarted()
  }
</script>

{#await p}
  <Progress />
{:then entry}
  <h1>{entry.title}</h1>
  <div class="uk-margin-bottom">
    {#if entry.isArchived}
      <button onclick={doDelete} class="uk-button uk-button-default">Удалить</button>
      <button onclick={doUnarchive} class="uk-button uk-button-default">Восстановить</button>
    {:else}
      <button onclick={doArchive} class="uk-button uk-button-default">В архив</button>
    {/if}

    <button onclick={doEdit} class="uk-button uk-button-primary">Редактировать</button>
    <button onclick={close} class="uk-button uk-button-default">Закрыть</button>
  </div>
  <div class="uk-card uk-card-default uk-card-body">
    {@html entry.html}
  </div>
{:catch error}
  <div class="uk-alert uk-alert-danger">
    <p>Ошибка: {error.message}</p>
  </div>
{/await}
