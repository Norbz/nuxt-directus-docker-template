
export interface ExtensionSeoMetadata {
    title?: string;
    meta_description?: string;
    og_image?: string;
    additional_fields?: Record<string, unknown>;
    sitemap?: {
        change_frequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
        priority: string;
    };
    no_index?: boolean;
    no_follow?: boolean;
}

export interface AiPrompt {
	date_created?: string | null;
	date_updated?: string | null;
	/** @description Briefly explain what this prompt does in 1-2 sentences. */
	description?: string | null;
	/** @primaryKey */
	id: string;
	/** @description Optional: Define the conversation structure between users and AI. Used to add context and improve outputs. */
	messages?: Array<{ role: 'user' | 'assistant'; text: string }> | null;
	/** @description Unique name for the prompt. Use names like "create-article" or "generate-product-description". @required */
	name: string;
	sort?: number | null;
	/** @description Is this prompt published and available to use? */
	status?: 'draft' | 'in_review' | 'published';
	/** @description Instructions that shape how the AI responds. */
	system_prompt?: string | null;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockButton {
	/** @description The id of the Button Group this button belongs to. */
	button_group?: BlockButtonGroup | string | null;
	date_created?: string | null;
	date_updated?: string | null;
	/** @primaryKey */
	id: string;
	/** @description Text to include on the button. */
	label?: string | null;
	/** @description The internal page to link to. */
	page?: Page | string | null;
	/** @description The internal post to link to. */
	post?: Post | string | null;
	sort?: number | null;
	/** @description What type of link is this? Page and Post allow you to link to internal content. URL is for external content. Group can contain other menu items. */
	type?: 'page' | 'post' | 'url' | null;
	/** @description The URL to link to. Could be relative (ie `/my-page`) or a full external URL (ie `https://docs.directus.io`) */
	url?: string | null;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
	/** @description What type of button */
	variant?: 'default' | 'outline' | 'soft' | 'ghost' | 'link' | null;
}

export interface BlockButtonGroup {
	date_created?: string | null;
	date_updated?: string | null;
	/** @primaryKey */
	id: string;
	sort?: number | null;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
	/** @description Add individual buttons to the button group. */
	buttons?: BlockButton[] | string[];
}

export interface BlockEmbed {
	/** @description HTML code for embedding external content (iframe, embed codes, etc.) @required */
	embed_code: string;
	/** @description Larger main headline for this page section. */
	headline?: string | null;
	/** @description Height of the embedded content in pixels (leave empty for auto) */
	height?: number | null;
	/** @primaryKey */
	id: number;
	/** @description Name of the embed (for internal reference) @required */
	name: string;
	/** @description Smaller copy shown above the headline to label a section or add extra context. */
	tagline?: string | null;
	/** @description Width of the embedded content */
	width?: 'full' | 'wide' | 'normal' | null;
}

export interface BlockForm {
	date_created?: string | null;
	date_updated?: string | null;
	/** @description Form to show within block */
	form?: Form | string | null;
	/** @description Larger main headline for this page section. */
	headline?: string | null;
	/** @primaryKey */
	id: string;
	/** @description Smaller copy shown above the headline to label a section or add extra context. */
	tagline?: string | null;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockGallery {
	date_created?: string | null;
	date_updated?: string | null;
	/** @description Larger main headline for this page section. */
	headline?: string | null;
	/** @primaryKey */
	id: string;
	/** @description Smaller copy shown above the headline to label a section or add extra context. */
	tagline?: string | null;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
	/** @description Images to include in the image gallery. */
	items?: BlockGalleryItem[] | string[];
}

export interface BlockGalleryItem {
	/** @description The id of the gallery block this item belongs to. */
	block_gallery?: BlockGallery | string | null;
	date_created?: string | null;
	date_updated?: string | null;
	/** @description The id of the file included in the gallery. */
	directus_file?: DirectusFile | string | null;
	/** @primaryKey */
	id: string;
	sort?: number | null;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockHero {
	/** @description Action buttons that show below headline and description. */
	button_group?: BlockButtonGroup | string | null;
	date_created?: string | null;
	date_updated?: string | null;
	/** @description Supporting copy that shows below the headline. */
	description?: string | null;
	/** @description Larger main headline for this page section. */
	headline?: string | null;
	/** @primaryKey */
	id: string;
	/** @description Featured image in the hero. */
	image?: DirectusFile | string | null;
	/** @description The layout for the component. You can set the image to display left, right, or in the center of page.. */
	layout?: 'image_left' | 'image_center' | 'image_right' | null;
	/** @description Smaller copy shown above the headline to label a section or add extra context. */
	tagline?: string | null;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockIframe {
	date_created?: string | null;
	date_updated?: string | null;
	/** @primaryKey */
	id: number;
	/** @required */
	name: string;
	url?: string | null;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockPost {
	/** @description The collection of content to fetch and display on the page within this block. @required */
	collection: 'posts';
	date_created?: string | null;
	date_updated?: string | null;
	/** @description Larger main headline for this page section. */
	headline?: string | null;
	/** @primaryKey */
	id: string;
	limit?: number | null;
	/** @description Smaller copy shown above the headline to label a section or add extra context. */
	tagline?: string | null;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockPricing {
	date_created?: string | null;
	date_updated?: string | null;
	/** @description Larger main headline for this page section. */
	headline?: string | null;
	/** @primaryKey */
	id: string;
	/** @description Smaller copy shown above the headline to label a section or add extra context. */
	tagline?: string | null;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
	/** @description The individual pricing cards to display. */
	pricing_cards?: BlockPricingCard[] | string[];
}

export interface BlockPricingCard {
	/** @description Badge that displays at the top of the pricing plan card to add helpful context. */
	badge?: string | null;
	/** @description The action button / link shown at the bottom of the pricing card. */
	button?: BlockButton | string | null;
	date_created?: string | null;
	date_updated?: string | null;
	/** @description Short, one sentence description of the pricing plan and who it is for. */
	description?: string | null;
	/** @description Short list of features included in this plan. Press `Enter` to add another item to the list. */
	features?: 'json' | null;
	/** @primaryKey */
	id: string;
	/** @description Add highlighted border around the pricing plan to make it stand out. */
	is_highlighted?: boolean | null;
	/** @description Price and term for the pricing plan. (ie `$199/mo`) */
	price?: string | null;
	/** @description The id of the pricing block this card belongs to. */
	pricing?: BlockPricing | string | null;
	sort?: number | null;
	/** @description Name of the pricing plan. Shown at the top of the card. */
	title?: string | null;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockRichtext {
	/** @description Controls how the content block is positioned on the page. Choose "Left" to align the block against the left margin or "Center" to position the block in the middle of the page. This setting affects the entire content block's placement, not the text alignment within it. */
	alignment?: 'left' | 'center' | null;
	/** @description Rich text content for this block. */
	content?: string | null;
	date_created?: string | null;
	date_updated?: string | null;
	/** @description Larger main headline for this page section. */
	headline?: string | null;
	/** @primaryKey */
	id: string;
	/** @description Smaller copy shown above the headline to label a section or add extra context. */
	tagline?: string | null;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
}

export interface FormField {
	/** @description Options for radio or select inputs */
	choices?: Array<{ text: string; value: string }> | null;
	date_created?: string | null;
	date_updated?: string | null;
	/** @description Parent form this field belongs to. */
	form?: Form | string | null;
	/** @description Additional instructions shown below the input */
	help?: string | null;
	/** @primaryKey */
	id: string;
	/** @description Text label shown to form users. */
	label?: string | null;
	/** @description Unique field identifier, not shown to users (lowercase, hyphenated) */
	name?: string | null;
	/** @description Default text shown in empty input. */
	placeholder?: string | null;
	/** @description Make this field mandatory to complete. */
	required?: boolean | null;
	sort?: number | null;
	/** @description Input type for the field */
	type?: 'text' | 'textarea' | 'checkbox' | 'checkbox_group' | 'radio' | 'file' | 'select' | 'hidden' | null;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
	/** @description Available rules: `email`, `url`, `min:5`, `max:20`, `length:10`. Combine with pipes example: `email|max:255` */
	validation?: string | null;
	/** @description Field width on the form */
	width?: '100' | '67' | '50' | '33' | null;
}

export interface FormSubmissionValue {
	field?: FormField | string | null;
	file?: DirectusFile | string | null;
	/** @description Parent form submission for this value. */
	form_submission?: FormSubmission | string | null;
	/** @primaryKey */
	id: string;
	sort?: number | null;
	/** @description Form submission date and time. */
	timestamp?: string | null;
	/** @description The data entered by the user for this specific field in the form submission. */
	value?: string | null;
}

export interface FormSubmission {
	/** @description Associated form for this submission. */
	form?: Form | string | null;
	/** @description Unique ID for this specific form submission @primaryKey */
	id: string;
	/** @description Form submission date and time. */
	timestamp?: string | null;
	/** @description Submitted field responses */
	values?: FormSubmissionValue[] | string[];
}

export interface Form {
	date_created?: string | null;
	date_updated?: string | null;
	/** @description Setup email notifications when forms are submitted. */
	emails?: Array<{ to: string[]; subject: string; message: string }> | null;
	/** @primaryKey */
	id: string;
	/** @description Show or hide this form from the site. */
	is_active?: boolean | null;
	/** @description Action after successful submission. */
	on_success?: 'redirect' | 'message' | null;
	sort?: number | null;
	/** @description Text shown on submit button. */
	submit_label?: string | null;
	/** @description Message shown after successful submission. */
	success_message?: string | null;
	/** @description Destination URL after successful submission. */
	success_redirect_url?: string | null;
	/** @description Form name (for internal reference). */
	title?: string | null;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
	/** @description Form structure and input fields */
	fields?: FormField[] | string[];
	/** @description Received form responses. */
	submissions?: FormSubmission[] | string[];
}

export interface Globals {
	/** @description Accent color for the website (used on buttons, links, etc). */
	accent_color?: string | null;
	date_created?: string | null;
	date_updated?: string | null;
	/** @description Site summary for search results. */
	description?: string | null;
	/** @description The public URL for this Directus instance. Used in Flows. */
	directus_url?: string | null;
	/** @description Small icon for browser tabs. 1:1 ratio. No larger than 512px × 512px. */
	favicon?: DirectusFile | string | null;
	/** @primaryKey */
	id: string;
	/** @description Main logo shown on the site (for light mode). */
	logo?: DirectusFile | string | null;
	/** @description Main logo shown on the site (for dark mode). */
	logo_dark_mode?: DirectusFile | string | null;
	/** @description Secret OpenAI API key. Don't share with anyone outside your team. */
	openai_api_key?: string | null;
	/** @description Social media profile URLs */
	social_links?: Array<{ url: string; service: 'facebook' | 'instagram' | 'linkedin' | 'x' | 'vimeo' | 'youtube' | 'github' | 'discord' | 'docker' }> | null;
	/** @description Short phrase describing the site. */
	tagline?: string | null;
	/** @description Main site title */
	title?: string | null;
	/** @description Public URL for the website */
	url?: string | null;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
}

export interface Language {
	/** @primaryKey */
	code: string;
	direction?: 'ltr' | 'rtl' | null;
	name?: string | null;
}

export interface Navigation {
	date_created?: string | null;
	date_updated?: string | null;
	/** @description Unique identifier for this menu. Can't be edited after creation. @primaryKey */
	id: string;
	/** @description Show or hide this menu from the site. */
	is_active?: boolean | null;
	/** @description What is the name of this menu? Only used internally. */
	title?: string | null;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
	/** @description Links within the menu. */
	items?: NavigationItem[] | string[];
}

export interface NavigationItem {
	date_created?: string | null;
	date_updated?: string | null;
	/** @primaryKey */
	id: string;
	/** @description Navigation menu that the individual links belong to. */
	navigation?: Navigation | string | null;
	/** @description The internal page to link to. */
	page?: Page | string | null;
	/** @description The parent navigation item. */
	parent?: NavigationItem | string | null;
	/** @description The internal post to link to. */
	post?: Post | string | null;
	sort?: number | null;
	/** @description Label shown to the user for the menu item. @required */
	title: string;
	/** @description What type of link is this? Page and Post allow you to link to internal content. URL is for external content. Group can contain other menu items. */
	type?: 'page' | 'post' | 'url' | 'group' | null;
	/** @description The URL to link to. Could be relative (ie `/my-page`) or a full external URL (ie `https://docs.directus.io`) */
	url?: string | null;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
	/** @description Add child menu items within the group. */
	children?: NavigationItem[] | string[];
}

export interface PageBlock {
	/** @description Background color for the block to create contrast. Does not control dark or light mode for the entire site. */
	background?: 'light' | 'dark' | null;
	/** @description The collection (type of block). */
	collection?: string | null;
	date_created?: string | null;
	date_updated?: string | null;
	/** @description Temporarily hide this block on the website without having to remove it from your page. */
	hide_block?: boolean | null;
	icon?: string | null;
	/** @primaryKey */
	id: string;
	/** @description The data for the block. */
	item?: BlockHero | BlockRichtext | BlockForm | BlockPost | BlockGallery | BlockPricing | BlockIframe | BlockEmbed | string | null;
	/** @description The id of the page that this block belongs to. */
	page?: Page | string | null;
	sort?: number | null;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
}

export interface Page {
	date_created?: string | null;
	date_updated?: string | null;
	/** @primaryKey */
	id: string;
	/** @description URL unique pour cette page (commence par `/`, peut avoir plusieurs segments `/a-propos/moi`). @required */
	permalink: string;
	/** @description Publiez maintenant ou programmez pour plus tard. */
	published_at?: string | null;
	seo?: ExtensionSeoMetadata | null;
	sort?: number | null;
	/** @description Cette page est-elle publiée ? */
	status?: 'draft' | 'in_review' | 'scheduled' | 'published';
	/** @description Le titre de cette page. @required */
	title: string;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
	/** @description Créez et organisez différents blocs de contenu (texte, images ou vidéos) pour construire votre page. */
	blocks?: PageBlock[] | string[];
}

export interface PagesTranslation {
	/** @primaryKey */
	id: number;
	languages_code?: Language | string | null;
	pages_id?: Page | string | null;
}

export interface Post {
	/** @description Select the team member who wrote this post */
	author?: DirectusUser | string | null;
	/** @description Rich text content of your blog post. */
	content?: string | null;
	date_created?: string | null;
	date_updated?: string | null;
	/** @description Short summary of the blog post to entice readers. */
	description?: string | null;
	icon?: string | null;
	/** @primaryKey */
	id: string;
	/** @description Featured image for this post. Used in cards linking to the post and in the post detail page. */
	image?: DirectusFile | string | null;
	/** @description Publish now or schedule for later. */
	published_at?: string | null;
	seo?: ExtensionSeoMetadata | null;
	/** @description Unique URL for this post (e.g., `yoursite.com/posts/{{your-slug}}`) */
	slug?: string | null;
	sort?: number | null;
	/** @description Is this post published? */
	status?: 'draft' | 'in_review' | 'published';
	/** @description Title of the blog post (used in page title and meta tags) @required */
	title: string;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
}

export interface Redirect {
	date_created?: string | null;
	date_updated?: string | null;
	/** @primaryKey */
	id: string;
	/** @description Short explanation of why the redirect was created. */
	note?: string | null;
	response_code?: '301' | '302' | null;
	/** @description Old URL has to be relative to the site (ie `/blog` or `/news`). It cannot be a full url like (https://example.com/blog) */
	url_from?: string | null;
	/** @description The URL you're redirecting to. This can be a relative url (/resources/matt-is-cool) or a full url (https://example.com/blog). */
	url_to?: string | null;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
}

export interface DirectusAccess {
	/** @primaryKey */
	id: string;
	role?: DirectusRole | string | null;
	user?: DirectusUser | string | null;
	policy?: DirectusPolicy | string;
	sort?: number | null;
}

export interface DirectusActivity {
	/** @primaryKey */
	id: number;
	action?: string;
	user?: DirectusUser | string | null;
	timestamp?: string;
	ip?: string | null;
	user_agent?: string | null;
	collection?: string;
	item?: string;
	origin?: string | null;
	revisions?: DirectusRevision[] | string[];
}

export interface DirectusCollection {
	/** @primaryKey */
	collection: string;
	icon?: string | null;
	note?: string | null;
	display_template?: string | null;
	hidden?: boolean;
	singleton?: boolean;
	translations?: Array<{ language: string; translation: string; singular: string; plural: string }> | null;
	archive_field?: string | null;
	archive_app_filter?: boolean;
	archive_value?: string | null;
	unarchive_value?: string | null;
	sort_field?: string | null;
	accountability?: 'all' | 'activity' | null | null;
	color?: string | null;
	item_duplication_fields?: 'json' | null;
	sort?: number | null;
	group?: DirectusCollection | string | null;
	collapse?: string;
	preview_url?: string | null;
	versioning?: boolean;
}

export interface DirectusComment {
	/** @primaryKey */
	id: string;
	collection?: DirectusCollection | string;
	item?: string;
	comment?: string;
	date_created?: string | null;
	date_updated?: string | null;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
}

export interface DirectusField {
	/** @primaryKey */
	id: number;
	collection?: DirectusCollection | string;
	field?: string;
	special?: string[] | null;
	interface?: string | null;
	options?: 'json' | null;
	display?: string | null;
	display_options?: 'json' | null;
	readonly?: boolean;
	hidden?: boolean;
	sort?: number | null;
	width?: string | null;
	translations?: 'json' | null;
	note?: string | null;
	conditions?: 'json' | null;
	required?: boolean | null;
	group?: DirectusField | string | null;
	validation?: 'json' | null;
	validation_message?: string | null;
	searchable?: boolean;
}

export interface DirectusFile {
	/** @primaryKey */
	id: string;
	storage?: string;
	filename_disk?: string | null;
	filename_download?: string;
	title?: string | null;
	type?: string | null;
	folder?: DirectusFolder | string | null;
	uploaded_by?: DirectusUser | string | null;
	created_on?: string;
	modified_by?: DirectusUser | string | null;
	modified_on?: string;
	charset?: string | null;
	filesize?: number | null;
	width?: number | null;
	height?: number | null;
	duration?: number | null;
	embed?: string | null;
	description?: string | null;
	location?: string | null;
	tags?: string[] | null;
	metadata?: 'json' | null;
	focal_point_x?: number | null;
	focal_point_y?: number | null;
	tus_id?: string | null;
	tus_data?: 'json' | null;
	uploaded_on?: string | null;
}

export interface DirectusFolder {
	/** @primaryKey */
	id: string;
	name?: string;
	parent?: DirectusFolder | string | null;
}

export interface DirectusMigration {
	/** @primaryKey */
	version: string;
	name?: string;
	timestamp?: string | null;
}

export interface DirectusPermission {
	/** @primaryKey */
	id: number;
	collection?: string;
	action?: string;
	permissions?: 'json' | null;
	validation?: 'json' | null;
	presets?: 'json' | null;
	fields?: string[] | null;
	policy?: DirectusPolicy | string;
}

export interface DirectusPolicy {
	/** @primaryKey */
	id: string;
	/** @required */
	name: string;
	icon?: string;
	description?: string | null;
	ip_access?: string[] | null;
	enforce_tfa?: boolean;
	admin_access?: boolean;
	app_access?: boolean;
	permissions?: DirectusPermission[] | string[];
	users?: DirectusAccess[] | string[];
	roles?: DirectusAccess[] | string[];
}

export interface DirectusPreset {
	/** @primaryKey */
	id: number;
	bookmark?: string | null;
	user?: DirectusUser | string | null;
	role?: DirectusRole | string | null;
	collection?: string | null;
	search?: string | null;
	layout?: string | null;
	layout_query?: 'json' | null;
	layout_options?: 'json' | null;
	refresh_interval?: number | null;
	filter?: 'json' | null;
	icon?: string | null;
	color?: string | null;
}

export interface DirectusRelation {
	/** @primaryKey */
	id: number;
	many_collection?: string;
	many_field?: string;
	one_collection?: string | null;
	one_field?: string | null;
	one_collection_field?: string | null;
	one_allowed_collections?: string[] | null;
	junction_field?: string | null;
	sort_field?: string | null;
	one_deselect_action?: string;
}

export interface DirectusRevision {
	/** @primaryKey */
	id: number;
	activity?: DirectusActivity | string;
	collection?: string;
	item?: string;
	data?: 'json' | null;
	delta?: 'json' | null;
	parent?: DirectusRevision | string | null;
	version?: DirectusVersion | string | null;
}

export interface DirectusRole {
	/** @primaryKey */
	id: string;
	/** @required */
	name: string;
	icon?: string;
	description?: string | null;
	parent?: DirectusRole | string | null;
	children?: DirectusRole[] | string[];
	policies?: DirectusAccess[] | string[];
	users?: DirectusUser[] | string[];
}

export interface DirectusSession {
	/** @primaryKey */
	token: string;
	user?: DirectusUser | string | null;
	expires?: string;
	ip?: string | null;
	user_agent?: string | null;
	share?: DirectusShare | string | null;
	origin?: string | null;
	next_token?: string | null;
}

export interface DirectusSettings {
	/** @primaryKey */
	id: number;
	project_name?: string;
	project_url?: string | null;
	project_color?: string;
	project_logo?: DirectusFile | string | null;
	public_foreground?: DirectusFile | string | null;
	public_background?: DirectusFile | string | null;
	public_note?: string | null;
	auth_login_attempts?: number | null;
	auth_password_policy?: null | `/^.{8,}$/` | `/(?=^.{8,}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{';'?>.<,])(?!.*\\s).*$/` | null;
	storage_asset_transform?: 'all' | 'none' | 'presets' | null;
	storage_asset_presets?: Array<{ key: string; fit: 'contain' | 'cover' | 'inside' | 'outside'; width: number; height: number; quality: number; withoutEnlargement: boolean; format: 'auto' | 'jpeg' | 'png' | 'webp' | 'tiff' | 'avif'; transforms: 'json' }> | null;
	custom_css?: string | null;
	storage_default_folder?: DirectusFolder | string | null;
	basemaps?: Array<{ name: string; type: 'raster' | 'tile' | 'style'; url: string; tileSize: number; attribution: string }> | null;
	mapbox_key?: string | null;
	module_bar?: 'json' | null;
	project_descriptor?: string | null;
	default_language?: string;
	custom_aspect_ratios?: Array<{ text: string; value: number }> | null;
	public_favicon?: DirectusFile | string | null;
	default_appearance?: 'auto' | 'light' | 'dark';
	default_theme_light?: string | null;
	theme_light_overrides?: 'json' | null;
	default_theme_dark?: string | null;
	theme_dark_overrides?: 'json' | null;
	report_error_url?: string | null;
	report_bug_url?: string | null;
	report_feature_url?: string | null;
	public_registration?: boolean;
	public_registration_verify_email?: boolean;
	public_registration_role?: DirectusRole | string | null;
	public_registration_email_filter?: 'json' | null;
	visual_editor_urls?: Array<{ url: string }> | null;
	project_id?: string | null;
	mcp_enabled?: boolean;
	mcp_allow_deletes?: boolean;
	mcp_prompts_collection?: string | null;
	mcp_system_prompt_enabled?: boolean;
	mcp_system_prompt?: string | null;
	project_owner?: string | null;
	project_usage?: string | null;
	org_name?: string | null;
	product_updates?: boolean | null;
	project_status?: string | null;
	ai_openai_api_key?: string | null;
	ai_anthropic_api_key?: string | null;
	ai_system_prompt?: string | null;
	/** @description Settings for the Command Palette Module. */
	command_palette_settings?: Record<string, any> | null;
}

export interface DirectusUser {
	/** @primaryKey */
	id: string;
	first_name?: string | null;
	last_name?: string | null;
	email?: string | null;
	password?: string | null;
	location?: string | null;
	title?: string | null;
	description?: string | null;
	tags?: string[] | null;
	avatar?: DirectusFile | string | null;
	language?: string | null;
	tfa_secret?: string | null;
	status?: 'draft' | 'invited' | 'unverified' | 'active' | 'suspended' | 'archived';
	role?: DirectusRole | string | null;
	token?: string | null;
	last_access?: string | null;
	last_page?: string | null;
	provider?: string;
	external_identifier?: string | null;
	auth_data?: 'json' | null;
	email_notifications?: boolean | null;
	appearance?: null | 'auto' | 'light' | 'dark' | null;
	theme_dark?: string | null;
	theme_light?: string | null;
	theme_light_overrides?: 'json' | null;
	theme_dark_overrides?: 'json' | null;
	text_direction?: 'auto' | 'ltr' | 'rtl';
	/** @description Blog posts this user has authored. */
	posts?: Post[] | string[];
	policies?: DirectusAccess[] | string[];
}

export interface DirectusWebhook {
	/** @primaryKey */
	id: number;
	name?: string;
	method?: null;
	url?: string;
	status?: 'active' | 'inactive';
	data?: boolean;
	actions?: 'create' | 'update' | 'delete';
	collections?: string[];
	headers?: Array<{ header: string; value: string }> | null;
	was_active_before_deprecation?: boolean;
	migrated_flow?: DirectusFlow | string | null;
}

export interface DirectusDashboard {
	/** @primaryKey */
	id: string;
	name?: string;
	icon?: string;
	note?: string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	color?: string | null;
	panels?: DirectusPanel[] | string[];
}

export interface DirectusPanel {
	/** @primaryKey */
	id: string;
	dashboard?: DirectusDashboard | string;
	name?: string | null;
	icon?: string | null;
	color?: string | null;
	show_header?: boolean;
	note?: string | null;
	type?: string;
	position_x?: number;
	position_y?: number;
	width?: number;
	height?: number;
	options?: 'json' | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
}

export interface DirectusNotification {
	/** @primaryKey */
	id: number;
	timestamp?: string | null;
	status?: string | null;
	recipient?: DirectusUser | string;
	sender?: DirectusUser | string | null;
	subject?: string;
	message?: string | null;
	collection?: string | null;
	item?: string | null;
}

export interface DirectusShare {
	/** @primaryKey */
	id: string;
	name?: string | null;
	collection?: DirectusCollection | string;
	item?: string;
	role?: DirectusRole | string | null;
	password?: string | null;
	user_created?: DirectusUser | string | null;
	date_created?: string | null;
	date_start?: string | null;
	date_end?: string | null;
	times_used?: number | null;
	max_uses?: number | null;
}

export interface DirectusFlow {
	/** @primaryKey */
	id: string;
	name?: string;
	icon?: string | null;
	color?: string | null;
	description?: string | null;
	status?: string;
	trigger?: string | null;
	accountability?: string | null;
	options?: 'json' | null;
	operation?: DirectusOperation | string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	operations?: DirectusOperation[] | string[];
}

export interface DirectusOperation {
	/** @primaryKey */
	id: string;
	name?: string | null;
	key?: string;
	type?: string;
	position_x?: number;
	position_y?: number;
	options?: 'json' | null;
	resolve?: DirectusOperation | string | null;
	reject?: DirectusOperation | string | null;
	flow?: DirectusFlow | string;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
}

export interface DirectusTranslation {
	/** @primaryKey */
	id: string;
	/** @required */
	language: string;
	/** @required */
	key: string;
	/** @required */
	value: string;
}

export interface DirectusVersion {
	/** @primaryKey */
	id: string;
	key?: string;
	name?: string | null;
	collection?: DirectusCollection | string;
	item?: string;
	hash?: string | null;
	date_created?: string | null;
	date_updated?: string | null;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
	delta?: 'json' | null;
}

export interface DirectusExtension {
	enabled?: boolean;
	/** @primaryKey */
	id: string;
	folder?: string;
	source?: string;
	bundle?: string | null;
}

export interface DirectusSyncIdMap {
	/** @primaryKey */
	id: number;
	table?: string;
	sync_id?: string;
	local_id?: string;
	created_at?: string | null;
}

export interface Schema {
	ai_prompts: AiPrompt[];
	block_button: BlockButton[];
	block_button_group: BlockButtonGroup[];
	block_embed: BlockEmbed[];
	block_form: BlockForm[];
	block_gallery: BlockGallery[];
	block_gallery_items: BlockGalleryItem[];
	block_hero: BlockHero[];
	block_iframe: BlockIframe[];
	block_posts: BlockPost[];
	block_pricing: BlockPricing[];
	block_pricing_cards: BlockPricingCard[];
	block_richtext: BlockRichtext[];
	form_fields: FormField[];
	form_submission_values: FormSubmissionValue[];
	form_submissions: FormSubmission[];
	forms: Form[];
	globals: Globals;
	languages: Language[];
	navigation: Navigation[];
	navigation_items: NavigationItem[];
	page_blocks: PageBlock[];
	pages: Page[];
	pages_translations: PagesTranslation[];
	posts: Post[];
	redirects: Redirect[];
	directus_access: DirectusAccess[];
	directus_activity: DirectusActivity[];
	directus_collections: DirectusCollection[];
	directus_comments: DirectusComment[];
	directus_fields: DirectusField[];
	directus_files: DirectusFile[];
	directus_folders: DirectusFolder[];
	directus_migrations: DirectusMigration[];
	directus_permissions: DirectusPermission[];
	directus_policies: DirectusPolicy[];
	directus_presets: DirectusPreset[];
	directus_relations: DirectusRelation[];
	directus_revisions: DirectusRevision[];
	directus_roles: DirectusRole[];
	directus_sessions: DirectusSession[];
	directus_settings: DirectusSettings;
	directus_users: DirectusUser[];
	directus_webhooks: DirectusWebhook[];
	directus_dashboards: DirectusDashboard[];
	directus_panels: DirectusPanel[];
	directus_notifications: DirectusNotification[];
	directus_shares: DirectusShare[];
	directus_flows: DirectusFlow[];
	directus_operations: DirectusOperation[];
	directus_translations: DirectusTranslation[];
	directus_versions: DirectusVersion[];
	directus_extensions: DirectusExtension[];
	directus_sync_id_map: DirectusSyncIdMap[];
}

export enum CollectionNames {
	ai_prompts = 'ai_prompts',
	block_button = 'block_button',
	block_button_group = 'block_button_group',
	block_embed = 'block_embed',
	block_form = 'block_form',
	block_gallery = 'block_gallery',
	block_gallery_items = 'block_gallery_items',
	block_hero = 'block_hero',
	block_iframe = 'block_iframe',
	block_posts = 'block_posts',
	block_pricing = 'block_pricing',
	block_pricing_cards = 'block_pricing_cards',
	block_richtext = 'block_richtext',
	form_fields = 'form_fields',
	form_submission_values = 'form_submission_values',
	form_submissions = 'form_submissions',
	forms = 'forms',
	globals = 'globals',
	languages = 'languages',
	navigation = 'navigation',
	navigation_items = 'navigation_items',
	page_blocks = 'page_blocks',
	pages = 'pages',
	pages_translations = 'pages_translations',
	posts = 'posts',
	redirects = 'redirects',
	directus_access = 'directus_access',
	directus_activity = 'directus_activity',
	directus_collections = 'directus_collections',
	directus_comments = 'directus_comments',
	directus_fields = 'directus_fields',
	directus_files = 'directus_files',
	directus_folders = 'directus_folders',
	directus_migrations = 'directus_migrations',
	directus_permissions = 'directus_permissions',
	directus_policies = 'directus_policies',
	directus_presets = 'directus_presets',
	directus_relations = 'directus_relations',
	directus_revisions = 'directus_revisions',
	directus_roles = 'directus_roles',
	directus_sessions = 'directus_sessions',
	directus_settings = 'directus_settings',
	directus_users = 'directus_users',
	directus_webhooks = 'directus_webhooks',
	directus_dashboards = 'directus_dashboards',
	directus_panels = 'directus_panels',
	directus_notifications = 'directus_notifications',
	directus_shares = 'directus_shares',
	directus_flows = 'directus_flows',
	directus_operations = 'directus_operations',
	directus_translations = 'directus_translations',
	directus_versions = 'directus_versions',
	directus_extensions = 'directus_extensions',
	directus_sync_id_map = 'directus_sync_id_map'
}