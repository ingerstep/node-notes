import App from "./App.svelte";

function app() {
  const main = document.getElementById("main");

  if (!main) {
    throw new Error("Element with id 'main' not found.");
  }

  new App({
    target: main,
  });
}

app()
