<script lang="ts">
	import type { PageData } from './$types';
	import type { PublisherType } from '../../../types/publisher';
	import type { ResultType } from '../../../types/result';

	import { goto } from '$app/navigation';
	import PublisherEditor from '../../../components/PublisherEditor.svelte';
	import { callApi } from '../../../lib/client';

	const { data }: { data: PageData } = $props();
	const publisher: PublisherType = data.publisher;

	const onSubmit = async (data: PublisherType) => {
		const result = await callApi('/api/publishers', 'PUT', data);
		if (result.ok) {
			goto('/publishers');
		} else {
			alert(`Error! (${result.data})`);
		}
	};
</script>

<h2>Publisher - Edit</h2>
<PublisherEditor {publisher} callback={onSubmit}></PublisherEditor>
<div class="footer">
	<a href="/publishers">Back to Publishers</a>
</div>

<style>
	.footer {
		margin-top: 1rem;
	}
</style>
