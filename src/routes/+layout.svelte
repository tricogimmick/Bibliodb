<script>
	let { children } = $props();
    import '../app.css'
</script>

<h1>Bibliographic information Manager</h1>
<div class="page-container">
    {@render children()}
</div>

<style>
    h1 {
        margin: 0;
        padding: 1rem 2rem;
        width: 100%;
        background-color: black;
        color: lightgray;
    }
    .page-container {
        margin: 2rem 2rem;
        padding: 0;
    }
</style>
