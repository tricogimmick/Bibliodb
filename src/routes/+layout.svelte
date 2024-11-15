<script>
	let { children } = $props();
    import '../app.css'
</script>

<h1>Bibliographic information Manager</h1>
<div class="navi-bar">
    <ul>
        <li><a href="/persons">Persons</a></li>
        <li><a href="/publishers">Publishers</a></li>
        <li><a href="/brands">Brands</a></li>
        <li><a href="/series">Series</a></li>
        <li><a href="/works">Works</a></li>
        <li><a href="/prints">Prints</a></li>
    </ul>
</div>
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
    .navi-bar {
        margin-top: 0.2rem;
        ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
            li {
                display: inline-block;
                margin: 0 0.2rem 0 0.2rem;
                padding: 0.2rem;
                width: 100px;
                text-align: center;
                background-color: black;
                color: lightgray;
                font-weight: bold;
                a { 
                    display: inline-block;
                    width: 100%;
                    text-decoration: none;
                    color: unset;
                }
                a:hover {
                    color: orange;
                }
            }
        }
    }
    .page-container {
        margin: 2rem 2rem;
        padding: 0;
    }
</style>
