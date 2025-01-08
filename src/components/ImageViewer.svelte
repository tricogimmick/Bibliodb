<script lang="ts">
    type PropsType = {
        src: string;
        alt: string;
        height: string;
        width: string;
    }
    let { src, alt, height, width } : PropsType = $props();

    const onClick = (e: MouseEvent) => {
        const dlg = document.createElement("dialog");
        dlg.style.border = "1px solid gray";
        const imgContainer = document.createElement("div");
        const img = document.createElement("img");
        img.src = src;
        img.alt = alt;
        img.style.maxHeight = "80vh";
        imgContainer.append(img);
        const buttonContainer = document.createElement("div");
        buttonContainer.style.margin = "0";
        buttonContainer.style.padding = "1em 1em";
        buttonContainer.style.textAlign = "center";
        const closeButton = document.createElement("button");
        closeButton.innerText = "Close";
        closeButton.addEventListener("click", () => {
            console.log("Click Close Button");
            console.log(dlg);
            dlg.close();
            dlg.remove();
        });
        buttonContainer.append(closeButton);
        dlg.append(imgContainer);
        dlg.append(buttonContainer);
        document.querySelector("body")?.append(dlg);
        dlg.showModal();
    };

    const style = `max-width: ${width}; max-height: ${height};`;

</script>
<button  onclick={onClick}><img src={src} alt={alt} style={style} /></button>

<style>
    button {
        margin: 0;
        padding: 0;
        border: none;
        img {
            margin: 0;
            padding: 0;
        }
    }
    button:hover {
        cursor: pointer;
    }
</style>