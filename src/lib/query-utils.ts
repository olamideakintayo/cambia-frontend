import {OrderListParams} from "@/lib/services/order-service";
import {ProductSearchParams} from "@/lib/services/product-service";

export function toQueryParams(params?: OrderListParams | undefined): Record<string, string | number> | undefined {
    if (!params) return undefined
    const query: Record<string, string | number> = {}
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            query[key] = value
        }
    })
    return query
}
