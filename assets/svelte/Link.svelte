<script lang="ts">
  export let href: string;
  export let external = false;
</script>

<a
  {href}
  target={external ? "_blank" : undefined}
  rel={external ? "noopener noreferrer" : undefined}
  class="
    font-semibold underline underline-offset-4 hover:no-underline rounded
    focus:outline-none focus-visible:ring ring-accent ring-offset-1 ring-offset-base-100
  "
>
  <slot />
</a>
