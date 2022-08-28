import { invalidate } from '$app/navigation';

// this action (https://svelte.dev/tutorial/actions) allows us to
// progressively enhance a <form> that already works without JS
export function enhance(form, { pending, error, result } = {}) {
	let current_token;

	async function handle_submit(event) {
		const token = (current_token = {});

		event.preventDefault();

		const data = new FormData(form);

		if (pending) pending({ data, form });

		try {
			const response = await fetch(form.action, {
				method: form.method,
				headers: {
					accept: 'application/json'
				},
				body: data
			});

			if (token !== current_token) return;

			if (response.ok) {
				if (result) result({ data, form, response });
				invalidate();
			} else if (error) {
				error({ data, form, error: null, response });
			} else {
				console.error(await response.text());
			}
		} catch (err) {
			if (error && err instanceof Error) {
				error({ data, form, error: err, response: null });
			} else {
				throw err;
			}
		}
	}

	form.addEventListener('submit', handle_submit);

	return {
		destroy() {
			form.removeEventListener('submit', handle_submit);
		}
	};
}
