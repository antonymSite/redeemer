import { refreshMeta } from "../../common/token-handler.mjs"

export const handler = async (event, context) => {
	try {
		const data = await refreshMeta(event.queryStringParamters.id)
		return {
			statusCode: 200,
			body: JSON.stringify({
				called: uri,
				data
			}),
		}
	} catch (error) {
		console.log('Error:', error)

		return {
			statusCode: 500,
			body: JSON.stringify({ ok: false, error }),
		}
	}
}
