<script lang="ts">
	import type { BrandType } from '../../../types/brand';

	import { goto } from '$app/navigation';
	import { createBrandType } from '../../../types/brand';
	import BrandEditor from '../../../components/BrandEditor.svelte';
	import { callApi } from '../../../lib/client';

	let brand: BrandType = createBrandType();

	const onSubmit = async (data: BrandType) => {
		const result = await callApi('/api/brands', 'POST', data);
		if (result.ok) {
			goto('/brands');
		} else {
			alert(`Error! (${result.data})`);
		}
	};
</script>

<h2>Brands - Append</h2>
<BrandEditor {brand} callback={onSubmit}></BrandEditor>
<div class="footer">
	<a href="/brands">Back to Brands</a>
</div>
