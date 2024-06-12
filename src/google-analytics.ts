export const GA_TRACKING_ID = 'G-8DFCLVD62S';

// Log the pageview with the given URL
export const pageview = (url: string) => {
/* @ts-ignore */
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// Log specific events happening.
/* @ts-ignore */
export const event = ({ action, category, label, value }) => {
  /* @ts-ignore */
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};