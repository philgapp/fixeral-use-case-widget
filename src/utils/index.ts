import { CURRENCY, LOCALE } from "@constants/index";

export const formatDate = (date: Date) => {
    return date.toLocaleDateString(LOCALE);
};

export const formatPrice = (price: number, currency = true): string => {
    const formatedPrice = price.toFixed(2);
    if (currency) {
        return `${formatedPrice} ${CURRENCY}`;
    }
    return formatedPrice;
};

export const formatPriceRange = (from?: number, to?: number): string => {
    if (from === undefined || to === undefined) {
        return "";
    }
    if (from === to) {
        return formatPrice(from);
    }
    return `${formatPrice(from, false)} - ${formatPrice(to)}`;
};
