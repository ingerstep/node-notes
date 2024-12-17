<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte'
  import EasyMDE from 'easymde'

  import Progress from './Progress.svelte'
  import { getNote, editNote } from './api'

  export let params: { id: string }
  const dispatch = createEventDispatcher()

  let title: string = ''
  let textarea: HTMLTextAreaElement | null = null
  let fetching: Promise<any> | null = null
  let mdEditor: EasyMDE | null = null

  onMount(() => {
    fetching = getNote(params.id).then((data) => {
      title = data.title
      setTimeout(() => {
        if (textarea) {
          mdEditor = new EasyMDE({
            element: textarea,
            forceSync: true,
            status: false,
            initialValue: data.text,
          })
        }
      })
    })

    return () => {
      mdEditor?.cleanup()
    }
  })

  const save = async () => {
    const text = textarea?.value.trim() || ''
    if (!title.trim() && !text) return

    await editNote(params.id, title, text)
    dispatch('routeEvent', { type: 'note-edited', id: params.id })
  }

  const cancel = () => {
    dispatch('routeEvent', { type: 'note-edit-cancelled', id: params.id })
  }
</script>

{#await fetching}
  <Progress />
{:then _}
  <div class="uk-margin-bottom">
    <button onclick={save} class="uk-button uk-button-primary">
      <i class="fas fa-save"></i>
      &nbsp;Сохранить
    </button>
    <button onclick={cancel} class="uk-button uk-button-default">
      <i class="fas fa-undo"></i>
      &nbsp;Отмена
    </button>
  </div>

  <div class="uk-margin">
    <input bind:value={title} class="uk-input" type="text" placeholder="Заголовок" />
  </div>

  <div class="uk-margin">
    <textarea bind:this={textarea} class="uk-textarea"></textarea>
  </div>
{:catch error}
  <div class="uk-alert uk-alert-danger">
    <p>Ошибка: {error.message}.</p>
  </div>
{/await}
