import type { ResultType } from "../types/result";

// APIの呼出
export async function callApi<T>(url: string, method: "POST" | "PUT", postData: T): Promise<ResultType<T>> {
    const response = await fetch(url, {
        method: method,
        body: JSON.stringify(postData),
        headers: {
            'content-type': 'application/json'
        }
    });
    if (response.ok) {
        return await response.json() as ResultType<T>;
    } else {
        throw new Error(`Fetch Error (${response.status})`)
    }
}

// 確認ダイアログの表示
export async function confirmDialog(title: string,message: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
        const dialog = document.createElement("dialog");
        dialog.classList.add("confirm-dialog");
        dialog.innerHTML = `
            <div class="dialog-header">
                ${title}
            </div>
            <form method="dialog">
                <p>${message}</p>
                <menu>
                    <button value="cancel">CANCEL</button>
                    <button value="ok">OK</button>
                </menu>
            </form>
        `;
        document.body.appendChild(dialog);
        dialog.addEventListener("close", () => {
            resolve(dialog.returnValue === "ok");
            dialog.remove();
        });
        dialog.showModal();
    });
}
