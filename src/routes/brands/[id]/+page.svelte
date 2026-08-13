<script lang="ts">
	import type { PageData } from './$types';
	import type { BrandType } from '../../../types/brand';

	import { goto } from '$app/navigation';
	import BrandEditor from '../../../components/BrandEditor.svelte';
	import { callApi } from '../../../lib/client';

	const { data }: { data: PageData } = $props();
	const brand: BrandType = data.brand as BrandType;

	const onSubmit = async (data: BrandType) => {
		try {
			const result = await callApi('/api/brands', 'PUT', data);
			if (result.ok) {
				goto('/brands');
			} else {
				alert(`Error! (${result.data})`);
			}
		} catch (e: unknown) {
			if (e instanceof Error) {
				alert(`Error: ${e.message}`);
			} else {
				alert('Error: Unknown');
				console.log(e);
			}
		}
	};
</script>

<h2>Brands - Edit</h2>
<BrandEditor {brand} callback={onSubmit}></BrandEditor>
<div class="footer">
	<a href="/brands">Back to Brands</a>
</div>
