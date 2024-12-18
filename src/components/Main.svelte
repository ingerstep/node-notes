<script lang="ts">
  import Router, { link, location, push } from 'svelte-spa-router'
  import { routerPrefix, routePatterns, getActiveNoteId } from './lib'
  import { deleteAllArchived } from './api'
  import { getNotes } from './api'

  import NoteCard from './NoteCard.svelte'
  import Progress from './Progress.svelte'
  import NoteView from './NoteView.svelte'
  import NoteNew from './NoteNew.svelte'
  import NoteEdit from './NoteEdit.svelte'

  export const routes = {
    [routePatterns.new]: NoteNew,
    [routePatterns.view]: NoteView,
    [routePatterns.edit]: NoteEdit,
  }

  $: activeNoteId = getActiveNoteId($location)

  let fetching: Promise<boolean> | null = null
  let search: string = ''
  let age: string = '1month'
  let page: number = 1
  let entries: Array<any> = []

  const fetch = async (
    p0: string = '',
    p1: { method: string; body: URLSearchParams; headers: { 'Content-Type': string } },
    options?: { reset?: boolean }
  ) => {
    const { reset = false } = options || {}

    if (reset) {
      page = 1
      entries = []
    }

    fetching = getNotes({ age, search, page }).then((data) => {
      entries = [...entries, ...data.data]
      return data.hasMore
    })

    return fetching
  }

  const loadMore = () => {
    page += 1
    return fetch()
  }

  const fetchFromScratch = ({ resetNav = true } = {}) => {
    if (resetNav) {
      push('/')
    }
    return fetch('', {}, { reset: true })
  }

  const refetch = async () => {
    const oldPage = page
    await fetchFromScratch({ resetNav: false })
    while (page < oldPage) {
      await loadMore()
    }
  }

  const deleteAll = async () => {
    await deleteAllArchived()
    age = '1month'
    fetchFromScratch()
  }

  const routeEvent = (event: CustomEvent) => {
    const { type, id } = event.detail || {}
    switch (type) {
      case 'note-create-cancelled':
      case 'note-closed':
        push('/')
        break
      case 'note-deleted':
      case 'note-archived':
      case 'note-unarchived':
        push('/')
        refetch()
        break
      case 'note-edit-started':
        push(`/note/${id}/edit`)
        break
      case 'note-edit-cancelled':
        push(`/note/${id}`)
        break
      case 'note-created':
      case 'note-edited':
        push(`/note/${id}`)
        refetch()
        break
    }
  }
</script>

<section class="uk-flex uk-grid-collapse">
  <aside class="uk-width-1-4 uk-padding-small">
    {#if age !== 'archive'}
      {#if activeNoteId === 'new'}
        <button disabled class="uk-button uk-button-primary uk-display-block uk-width-1-1">Новая заметка</button>
      {:else}
        <a use:link href="/note/new" class="uk-button uk-button-primary uk-display-block uk-width-1-1">Новая заметка</a>
      {/if}
    {:else}
      <button onclick={deleteAll} class="uk-button uk-button-secondary uk-display-block uk-width-1-1">
        Удалить весь архив
      </button>
    {/if}

    <p>
      <select bind:value={age} onchange={fetchFromScratch} class="uk-select">
        <option value="1month">за месяц</option>
        <option value="3months">за 3 месяца</option>
        <option value="alltime">за всё время</option>
        <option value="archive">архив</option>
      </select>
    </p>

    {#each entries as entry}
      <NoteCard {entry} isActive={entry._id === activeNoteId} />
    {/each}

    {#await fetching}
      <Progress />
    {:then hasMore}
      {#if hasMore}
        <button onclick={loadMore} class="uk-button uk-button-secondary uk-margin-top uk-display-block uk-width-1-1">
          Загрузить ещё&hellip;
        </button>
      {/if}
    {:catch error}
      <div class="uk-alert uk-alert-danger">
        <p>Ошибка: {error.message}.</p>
      </div>
    {/await}
  </aside>
  <div class="uk-width-3-4 uk-padding-small">
    <Router
      {routes}
      prefix={routerPrefix}
      on:routeEvent={routeEvent}
      on:routeLoaded={() => {
        window.scrollTo(0, 0)
      }}
    />
  </div>
</section>
