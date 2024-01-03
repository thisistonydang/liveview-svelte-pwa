<script>
  export let href;
  export let external = false;
</script>

<a
  {href}
  target={external ? "_blank" : undefined}
  rel={external ? "noopener noreferrer" : undefined}
  class="font-semibold underline underline-offset-4 hover:no-underline"
>
  <slot />
</a>
