/// <reference types="@directus/extensions/api.d.ts" />
interface DirectusSchema {
    pages: Page[];
    form_submissions: FormSubmission
    navigation: Navigation[];
}

interface Page {
    id: number;
    title: string;
    permalink: string;
    status: string;
    published_at: string;
    seo: SEOMeta;
    blocks: Block[];
}

interface Navigation {
    id: string;
    title: string;
    items: NavigationItem[];
}

interface NavigationItem {
    id: string;
    navigation: string;
    page?: {
        permalink?: string;
    };
    parent: string | null;
    sort: number;
    title: string;
    type: string;
    url: string | null;
    post: string | null;
    children: NavigationItem[];
}

interface FormSubmission {
    id?: number;
    form: string;
    values: FormFieldValue[]
}

interface FormFieldValue {
    field: string;
    value: string;
}

interface Block {
    id: string;
    collection: string;
    item: Hero | RichText | Iframe | Embed | Pricing | Form;
    no_index: boolean;
    no_follow: boolean;
}

interface Hero {
    tagline: string;
    headline: string;
    description: string;
    button_group: ButtonGroup;
    image: Image;
}

interface ButtonGroup {
    buttons: Button[];
}

interface Button {
    label: string;
    url: string;
    variant: ButtonProps['variant'];
}

interface Image {
    id: number;
    title: string;
}

interface RichText {
    tagline: string;
    headline: string;
    content: string;
    alignment: string;
    hide_block: boolean;
}

interface Pricing {
    id: number;
    tagline: string;
    headline: string;
    pricing_cards: PricingCard[];
}

interface PricingCard {
    id: number;
    title: string;
    description: string;
    price: string;
    badge: string;
    features: string[];
    pricing: string;
    is_highlighted: boolean;
    sort?: number;
    button: Button;
}

interface Form {
    id: string;
    headline: string;
    tagline: string;
    form: FormElement;
}

interface FormElement {
    id: string;
    sort: number | null;
    title: string;
    is_active: boolean;
    submit_label: string;
    on_success: string;
    success_message: string;
    success_redirect_url: string | null;
    fields: FormField[];
}

interface FormField {
    id: string;
    name: string;
    type: string;
    label: string;
    placeholder: string | null | undefined;
    help: string | null | undefined;
    validation: string | null | undefined;
    width: string;
    choices: string[]| null;
    form: string;
    sort: number;
    required: boolean;
}

interface Iframe {
    id: number;
    name: string;
    url: string;
}

interface Embed {
    id: number;
    name: string;
    embed_code: string;
    headline?: string;
    tagline?: string;
    width?: 'full' | 'wide' | 'normal';
    height?: number;
}

interface SEOMeta {
    title: string;
    meta_description: string;
}
