let marketoScriptPromise = null;

function loadMarketoScript() {
	if (window.MktoForms2) return Promise.resolve(window.MktoForms2);
	if (marketoScriptPromise) return marketoScriptPromise;

	marketoScriptPromise = new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = "https://go.nutanix.com/js/forms2/js/forms2.min.js";
		script.async = true;
		script.dataset.marketoLoader = "true";
		script.addEventListener("load", () => resolve(window.MktoForms2), {
			once: true,
		});
		script.addEventListener(
			"error",
			() => reject(new Error("Marketo script failed to load")),
			{ once: true },
		);
		document.body.appendChild(script);
	}).catch((error) => {
		marketoScriptPromise = null;
		throw error;
	});

	return marketoScriptPromise;
}

function showMarketoError(container) {
	const loading = container.querySelector("#marketoLoading");
	const error = container.querySelector("#marketoError");
	const retry = container.querySelector("#retryMarketo");

	if (loading) loading.hidden = true;
	if (error) error.hidden = false;

	retry?.addEventListener(
		"click",
		() => {
			if (error) error.hidden = true;
			if (loading) loading.hidden = false;
			const form = container.querySelector("#mktoForm_4680");
			if (form) {
				form.dataset.loading = "false";
				initMarketoForm(container);
			}
		},
		{ once: true },
	);
}

export async function initMarketoForm(container = document, onSuccess = () => {}) {
	const formElement = container.querySelector("#mktoForm_4680");
	if (
		!formElement ||
		formElement.dataset.loading === "true" ||
		formElement.dataset.ready === "true"
	) {
		return;
	}

	formElement.dataset.loading = "true";

	try {
		const MktoForms2 = await loadMarketoScript();
		if (!formElement.isConnected) return;

		MktoForms2.loadForm(
			"https://go.nutanix.com",
			"031-GVQ-112",
			4680,
			(form) => {
				if (!formElement.isConnected) return;

				formElement.dataset.loading = "false";
				formElement.dataset.ready = "true";

				const loading = container.querySelector("#marketoLoading");
				const success = container.querySelector("#marketoSuccess");
				if (loading) loading.hidden = true;

				const marketoForm = form.getFormElem()[0];
				marketoForm.classList.add("nutanix-marketo-form");
				marketoForm.querySelectorAll(".mktoButtonRow .mktoButtonWrap").forEach((wrapper) => {
					wrapper.style.setProperty("margin-left", "0", "important");
					wrapper.style.setProperty("transform", "none", "important");
				});
				form.vals({ URL__c: window.location.href });

				form.onSuccess(() => {
					marketoForm.hidden = true;
					if (success) success.hidden = false;
					onSuccess();
					return false;
				});
			},
		);
	} catch (error) {
		formElement.dataset.loading = "false";
		showMarketoError(container);
	}
}
