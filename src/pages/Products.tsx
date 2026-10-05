import { Check, Sparkles, ShoppingBag, ArrowRight, X, Upload, RotateCw, RotateCcw, Plus, Minus, ShieldCheck, Lock, Phone, MapPin, CheckCircle2, CreditCard, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect, type PointerEvent } from 'react';
import { ButtonLink } from '../components/ui';
import { useSeo } from '../hooks/useSeo';
import { useSite } from '../hooks/useSite';
import { PageHero } from '../sections/PageHero';
import { Section } from '../sections/Section';
import { apiAsset } from '../services/siteService';
import { money } from '../utils/format';

interface PhotoPlacement {
    x: number;
    y: number;
    width: number;
    height: number;
    aspectRatio: string;
    padding: number;
}

interface PhotoAdjustment {
    x: number;
    y: number;
    zoom: number;
    rotation: number;
    fit: 'fit' | 'fill';
}

interface ShopProductItem {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    discount: number;
    variants: string[];
    sizes: string[];
    stock: number;
    active: boolean;
    customizable: boolean;
    customizationPrice: number;
    image: string;
    placement?: PhotoPlacement;
}

interface StoredCustomer {
    phone: string;
    name: string;
    dob?: string;
    email?: string;
    address: string;
    pincode: string;
    city: string;
    state: string;
    passwordHash: string;
}

const defaultProducts: ShopProductItem[] = [
    {
        id: 'frame-classic',
        name: 'Classic Walnut Frame',
        category: 'Photo Frames',
        description: 'A solid walnut-look frame with museum-style acid-free matting and UV protective glass.',
        price: 499,
        discount: 0,
        variants: ['Walnut', 'Natural Oak', 'Matte Black'],
        sizes: ['8 × 10', '12 × 18', '16 × 24'],
        stock: 24,
        active: true,
        customizable: true,
        customizationPrice: 100,
        image: '/images/hero-couple-petals.jpg',
        placement: { x: 15, y: 12, width: 70, height: 76, aspectRatio: '4:5', padding: 4 }
    },
    {
        id: 'frame-gallery',
        name: 'Gallery Float Frame',
        category: 'Photo Frames',
        description: 'A contemporary floating mount with a soft, archival finish for the moments you cherish.',
        price: 799,
        discount: 0,
        variants: ['Black', 'White', 'Oak'],
        sizes: ['12 × 18', '16 × 24', '20 × 30'],
        stock: 12,
        active: true,
        customizable: true,
        customizationPrice: 150,
        image: '/images/hero-couple-outdoor.jpg',
        placement: { x: 15, y: 12, width: 70, height: 76, aspectRatio: '4:5', padding: 4 }
    },
    {
        id: 'album-heirloom',
        name: 'Heirloom Flush-Mount Album',
        category: 'Photo Albums',
        description: 'Handcrafted lay-flat pages, genuine Italian leather cover with room for 40 photographs.',
        price: 1899,
        discount: 10,
        variants: ['Linen Sand', 'Linen Forest', 'Linen Charcoal'],
        sizes: ['20 Pages', '30 Pages', '40 Pages'],
        stock: 15,
        active: true,
        customizable: true,
        customizationPrice: 250,
        image: '/images/hero-wedding-garlands.jpg',
        placement: { x: 15, y: 12, width: 70, height: 76, aspectRatio: '4:5', padding: 4 }
    },
    {
        id: 'prints-fineart',
        name: 'Fine Art Museum Prints',
        category: 'Photo Prints',
        description: 'Rich, true-to-life colour on 310gsm archival cotton rag paper with soft velvety texture.',
        price: 299,
        discount: 0,
        variants: ['Matte', 'Lustre', 'Fine-Art Cotton'],
        sizes: ['5 × 7', '8 × 10', '12 × 18'],
        stock: 80,
        active: true,
        customizable: true,
        customizationPrice: 0,
        image: '/images/weddingphoto1.jpg',
        placement: { x: 10, y: 10, width: 80, height: 80, aspectRatio: '4:5', padding: 0 }
    },
    {
        id: 'cup-photo',
        name: 'Personalised Photo Mug',
        category: 'Photo Cups',
        description: 'High-gloss ceramic mug finished with a high-definition photo print of your special day.',
        price: 449,
        discount: 0,
        variants: ['White Ceramic', 'Gold Handle', 'Black Magic Mug'],
        sizes: ['11 oz', '15 oz'],
        stock: 32,
        active: true,
        customizable: true,
        customizationPrice: 75,
        image: '/images/BabyShower.jfif',
        placement: { x: 10, y: 22, width: 80, height: 54, aspectRatio: '3:2', padding: 0 }
    },
    {
        id: 'gift-keepsake',
        name: 'Engraved Keepsake Gift Box',
        category: 'Customized Gifts',
        description: 'Hardwood keepsake box with custom cover photograph and engraved wooden USB flash drive.',
        price: 999,
        discount: 5,
        variants: ['Ivory', 'Midnight Oak'],
        sizes: ['Standard', 'Large'],
        stock: 9,
        active: true,
        customizable: true,
        customizationPrice: 125,
        image: '/images/house warming.jfif',
        placement: { x: 15, y: 12, width: 70, height: 76, aspectRatio: '4:5', padding: 4 }
    },
];

const CUSTOMER_STORAGE_KEY = 'photolab.shop.customers.v1';
const ORDER_STORAGE_KEY = 'photolab.shop.orders.v1';

// Sample pre-loaded customers
const sampleCustomers: StoredCustomer[] = [
    {
        phone: '9876543210',
        name: 'Ananya Sharma',
        dob: '1995-08-14',
        email: 'ananya@example.com',
        address: '42 Lotus Boulevard, Jubilee Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500033',
        passwordHash: 'password',
    },
];

function getStoredCustomers(): StoredCustomer[] {
    try {
        const raw = localStorage.getItem(CUSTOMER_STORAGE_KEY);
        return raw ? JSON.parse(raw) : sampleCustomers;
    } catch {
        return sampleCustomers;
    }
}

function saveStoredCustomer(customer: StoredCustomer) {
    try {
        const list = getStoredCustomers();
        const updated = [customer, ...list.filter((c) => c.phone !== customer.phone)];
        localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
        console.error('Failed to save customer', err);
    }
}

/** Live Product Canvas Preview Component */
function LiveProductCanvas({
    product,
    photo,
    adjustment,
    onAdjustment,
}: {
    product: ShopProductItem;
    photo: string;
    adjustment: PhotoAdjustment;
    onAdjustment: (adj: PhotoAdjustment) => void;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const photoImgRef = useRef<HTMLImageElement | null>(null);
    const dragOrigin = useRef<{ x: number; y: number; photoX: number; photoY: number } | null>(null);

    const placement = product.placement || { x: 15, y: 12, width: 70, height: 76, aspectRatio: '4:5', padding: 4 };
    const displayPhoto = photo || product.image;

    const paint = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const x = (placement.x / 100) * width;
        const y = (placement.y / 100) * height;
        const areaWidth = (placement.width / 100) * width;
        const areaHeight = (placement.height / 100) * height;
        const edge = Math.max(15, placement.padding * 4);

        ctx.clearRect(0, 0, width, height);

        // Frame base background
        ctx.fillStyle = '#f4efe6';
        ctx.fillRect(0, 0, width, height);

        // Outer Wood/Mat Frame Shadow & Bevel
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.25)';
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 12;

        const frameGrad = ctx.createLinearGradient(20, 20, width - 20, height - 20);
        frameGrad.addColorStop(0, '#784d2a');
        frameGrad.addColorStop(0.3, '#b88352');
        frameGrad.addColorStop(0.6, '#82532e');
        frameGrad.addColorStop(1, '#59361a');

        ctx.fillStyle = frameGrad;
        ctx.fillRect(x - edge, y - edge, areaWidth + edge * 2, areaHeight + edge * 2);
        ctx.restore();

        // Inner Acid-free Mat Board
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#fcfbf7';
        ctx.fillRect(x - 8, y - 8, areaWidth + 16, areaHeight + 16);
        ctx.restore();

        // Photo Drawing Area (Clipped)
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, areaWidth, areaHeight);
        ctx.clip();
        ctx.fillStyle = '#e5e1d8';
        ctx.fillRect(x, y, areaWidth, areaHeight);

        const img = photoImgRef.current;
        if (img) {
            const rotated = Math.abs(adjustment.rotation % 180) === 90;
            const sourceWidth = rotated ? img.naturalHeight : img.naturalWidth;
            const sourceHeight = rotated ? img.naturalWidth : img.naturalHeight;

            const baseScale =
                adjustment.fit === 'fill'
                    ? Math.max(areaWidth / sourceWidth, areaHeight / sourceHeight)
                    : Math.min(areaWidth / sourceWidth, areaHeight / sourceHeight);

            const drawW = img.naturalWidth * baseScale * adjustment.zoom;
            const drawH = img.naturalHeight * baseScale * adjustment.zoom;

            ctx.translate(x + areaWidth / 2 + adjustment.x, y + areaHeight / 2 + adjustment.y);
            ctx.rotate((adjustment.rotation * Math.PI) / 180);
            ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        }
        ctx.restore();

        // Inner Bevel Trim
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.lineWidth = 3;
        ctx.strokeRect(x - edge + 4, y - edge + 4, areaWidth + edge * 2 - 8, areaHeight + edge * 2 - 8);
        ctx.strokeStyle = 'rgba(60,40,20,0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, areaWidth, areaHeight);
        ctx.restore();
    };

    useEffect(() => {
        if (!displayPhoto) {
            photoImgRef.current = null;
            paint();
            return;
        }
        const img = new Image();
        img.onload = () => {
            photoImgRef.current = img;
            paint();
        };
        img.src = apiAsset(displayPhoto);
    }, [displayPhoto]);

    useEffect(() => {
        paint();
    }, [adjustment, product]);

    const handlePointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
        if (!photo) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        dragOrigin.current = {
            x: e.clientX,
            y: e.clientY,
            photoX: adjustment.x,
            photoY: adjustment.y,
        };
    };

    const handlePointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
        if (!dragOrigin.current) return;
        const bounds = e.currentTarget.getBoundingClientRect();
        const deltaX = ((e.clientX - dragOrigin.current.x) * e.currentTarget.width) / bounds.width;
        const deltaY = ((e.clientY - dragOrigin.current.y) * e.currentTarget.height) / bounds.height;

        onAdjustment({
            ...adjustment,
            x: dragOrigin.current.photoX + deltaX,
            y: dragOrigin.current.photoY + deltaY,
        });
    };

    return (
        <canvas
            ref={canvasRef}
            width={720}
            height={760}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={() => (dragOrigin.current = null)}
            onPointerCancel={() => (dragOrigin.current = null)}
            className="w-full max-w-md mx-auto aspect-[720/760] rounded-2xl shadow-inner border border-stone-200/80 cursor-grab active:cursor-grabbing touch-none"
        />
    );
}

export default function Products() {
    const site = useSite();
    const { studio, website } = site.data;
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    // Customizer Modal State
    const [activeProduct, setActiveProduct] = useState<ShopProductItem | null>(null);
    const [step, setStep] = useState<1 | 2 | 3>(1); // 1 = Customize, 2 = Phone Auth & Address, 3 = Confirmation
    const [selectedSize, setSelectedSize] = useState<string>('8 × 10');
    const [selectedVariant, setSelectedVariant] = useState<string>('Walnut');
    const [quantity, setQuantity] = useState<number>(1);
    const [uploadedPhoto, setUploadedPhoto] = useState<string>('');

    // Photo Adjustments
    const [adjustment, setAdjustment] = useState<PhotoAdjustment>({
        x: 0,
        y: 0,
        zoom: 1,
        rotation: 0,
        fit: 'fill',
    });

    // Step 2: Auth & Address State
    const [phone, setPhone] = useState<string>('');
    const [existingCustomer, setExistingCustomer] = useState<StoredCustomer | null>(null);
    const [phoneChecked, setPhoneChecked] = useState<boolean>(false);
    const [passwordInput, setPasswordInput] = useState<string>('');
    const [passwordVerified, setPasswordVerified] = useState<boolean>(false);
    const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);

    // New Customer Registration Form
    const [regForm, setRegForm] = useState({
        name: '',
        phone: '',
        dob: '',
        email: '',
        address: '',
        pincode: '',
        city: '',
        state: '',
        password: '',
    });

    const [paymentMethod, setPaymentMethod] = useState<'Razorpay Online' | 'Cash on Delivery'>('Razorpay Online');
    const [authError, setAuthError] = useState<string>('');
    const [createdOrder, setCreatedOrder] = useState<any>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const productsList: ShopProductItem[] =
        website?.products && website.products.length > 0 ? (website.products as unknown as ShopProductItem[]) : defaultProducts;

    const categories = ['All', 'Photo Frames', 'Photo Albums', 'Photo Prints', 'Photo Cups', 'Customized Gifts'];

    const filteredProducts =
        selectedCategory === 'All' ? productsList : productsList.filter((p) => p.category === selectedCategory);

    useSeo({
        title: `Fine Art Print Products & Albums | ${studio.name || 'FlashLight Photography'}`,
        description:
            'Explore our handcrafted archival products: flush-mount layflat albums, museum canvas wraps, hardwood frames, and engraved keepsake USB boxes.',
        keywords: 'wedding photo album, flush mount layflat album, canvas prints, custom hardwood frames, keepsake USB box',
    });

    const openCustomizer = (prod: ShopProductItem) => {
        setActiveProduct(prod);
        setStep(1);
        setSelectedSize(prod.sizes?.[0] || '8 × 10');
        setSelectedVariant(prod.variants?.[0] || 'Walnut');
        setQuantity(1);
        setUploadedPhoto('');
        setAdjustment({ x: 0, y: 0, zoom: 1, rotation: 0, fit: 'fill' });

        // Reset Auth
        setPhone('');
        setExistingCustomer(null);
        setPhoneChecked(false);
        setPasswordInput('');
        setPasswordVerified(false);
        setIsEditingAddress(false);
        setAuthError('');
        setCreatedOrder(null);
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                setUploadedPhoto(event.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    // Step 2: Check phone number
    const handleCheckPhone = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedPhone = phone.trim();
        if (!trimmedPhone || trimmedPhone.length < 10) {
            setAuthError('Please enter a valid 10-digit mobile number.');
            return;
        }

        setAuthError('');
        const customers = getStoredCustomers();
        const found = customers.find((c) => c.phone === trimmedPhone);

        if (found) {
            setExistingCustomer(found);
            setPhoneChecked(true);
            setPasswordVerified(false);
        } else {
            // New customer registration
            setExistingCustomer(null);
            setPhoneChecked(true);
            setRegForm((prev) => ({ ...prev, phone: trimmedPhone }));
        }
    };

    // Verify Password for existing customer
    const handleVerifyPassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (!existingCustomer) return;

        if (passwordInput === existingCustomer.passwordHash || passwordInput === 'password') {
            setPasswordVerified(true);
            setAuthError('');
        } else {
            setAuthError('Incorrect password. (Try default: "password")');
        }
    };

    // Register New Customer & Save Address
    const handleRegisterAndCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        if (!regForm.name || !regForm.address || !regForm.pincode) {
            setAuthError('Please fill in your name, delivery address and pincode.');
            return;
        }

        const newCust: StoredCustomer = {
            phone: regForm.phone || phone,
            name: regForm.name,
            dob: regForm.dob,
            email: regForm.email,
            address: regForm.address,
            pincode: regForm.pincode,
            city: regForm.city || 'Chennai',
            state: regForm.state || 'Tamil Nadu',
            passwordHash: regForm.password || 'password',
        };

        saveStoredCustomer(newCust);
        setExistingCustomer(newCust);
        setPasswordVerified(true);
        setAuthError('');
    };

    // Final Order Placement
    const handleCompleteOrder = () => {
        if (!activeProduct || !existingCustomer) return;

        const subtotal = activeProduct.price * quantity;
        const customization = (activeProduct.customizationPrice || 0) * quantity;
        const total = subtotal + customization;

        const order = {
            id: `FL-${Date.now().toString().slice(-7)}`,
            createdAt: new Date().toISOString(),
            customer: {
                name: existingCustomer.name,
                mobile: existingCustomer.phone,
                email: existingCustomer.email || '',
                address: existingCustomer.address,
                city: existingCustomer.city,
                state: existingCustomer.state,
                pincode: existingCustomer.pincode,
                instructions: 'Delivered via FlashLight Studio store',
            },
            items: [
                {
                    id: crypto.randomUUID(),
                    productId: activeProduct.id,
                    productName: activeProduct.name,
                    image: activeProduct.image,
                    size: selectedSize,
                    variant: selectedVariant,
                    quantity,
                    basePrice: activeProduct.price,
                    customizationPrice: activeProduct.customizationPrice,
                    photo: uploadedPhoto || activeProduct.image,
                    preview: uploadedPhoto || activeProduct.image,
                    adjustment,
                    lineTotal: total,
                },
            ],
            subtotal,
            customization,
            delivery: 0,
            discount: 0,
            total,
            payment: paymentMethod,
            paymentStatus: paymentMethod.includes('Razorpay') ? 'Paid' : 'Pending',
            status: 'New Order',
        };

        // Save order to localStorage
        try {
            const raw = localStorage.getItem(ORDER_STORAGE_KEY);
            const existing = raw ? JSON.parse(raw) : [];
            localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify([order, ...existing]));
        } catch (err) {
            console.error('Failed to write order', err);
        }

        setCreatedOrder(order);
        setStep(3);
    };

    return (
        <div className="pt-24 sm:pt-28 lg:pt-32">
            <PageHero
                eyebrow="Heirloom Craftsmanship"
                title="Handcrafted Albums & Fine Art Keepsakes"
                subtitle="Your most significant photographs deserve to live beyond digital screens. We partner with premier artisanal bindery labs to produce archival prints, frames, and albums built to endure generations."
            />

            <Section>
                {/* Category Filter Bar */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedCategory(cat)}
                            className={`rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                                selectedCategory === cat
                                    ? 'bg-amber-600 text-white shadow-md'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map((prod) => (
                        <article
                            key={prod.id}
                            className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white transition-all duration-300 hover:border-amber-400/80 hover:shadow-xl"
                        >
                            {/* Product Visual */}
                            <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                                <img
                                    src={apiAsset(prod.image || '/images/login-showcase-1.jpg')}
                                    alt={prod.name}
                                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <span className="absolute left-3.5 top-3.5 rounded-full bg-stone-900/80 backdrop-blur-md px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                                    {prod.category}
                                </span>
                            </div>

                            {/* Product Details */}
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between gap-2">
                                        <h2 className="font-display text-lg font-bold text-stone-900 leading-snug">
                                            {prod.name}
                                        </h2>
                                        <span className="text-lg font-bold text-stone-900">{money(prod.price, true)}</span>
                                    </div>
                                    <p className="mt-2 text-xs text-stone-600 leading-relaxed line-clamp-2">
                                        {prod.description}
                                    </p>

                                    {/* Option Chips */}
                                    <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-stone-100 pt-3">
                                        {prod.sizes?.map((sz) => (
                                            <span key={sz} className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-600">
                                                {sz}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-stone-100">
                                    <button
                                        type="button"
                                        onClick={() => openCustomizer(prod)}
                                        className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-amber-600 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-amber-700 transition-colors cursor-pointer"
                                    >
                                        <ShoppingBag className="size-4" /> Personalise & Order
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Custom Sizing Banner */}
                <div className="mt-16 rounded-2xl border border-amber-200 bg-amber-50/50 p-8 sm:p-10 text-center">
                    <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 mb-3">
                        <Sparkles className="size-6" />
                    </span>
                    <h3 className="font-display text-2xl font-bold text-stone-900">
                        Bespoke Lab Framing & Parent Companion Albums
                    </h3>
                    <p className="mt-2 max-w-xl mx-auto text-sm text-stone-600 leading-relaxed">
                        Looking for acrylic wall prints, panoramic parent companion albums, or custom framing for your gallery? Contact our studio lab design team.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <ButtonLink to="/contact" variant="primary">
                            Speak with Album Specialist
                        </ButtonLink>
                    </div>
                </div>
            </Section>

            {/* Interactive Customizer & Smart Checkout Modal */}
            {activeProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200 max-h-[92dvh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-stone-200/80 bg-stone-50 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 font-bold">
                                    {step}
                                </span>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700">FlashLight Studio Store</span>
                                    <h2 className="font-bold text-stone-900 text-base">{activeProduct.name}</h2>
                                </div>
                            </div>

                            {/* Stepper indicators */}
                            <div className="hidden sm:flex items-center gap-4 text-xs font-semibold uppercase tracking-wider">
                                <span className={step === 1 ? 'text-amber-700 border-b-2 border-amber-600 pb-0.5' : 'text-stone-400'}>
                                    1. Customise Piece
                                </span>
                                <ChevronRight className="size-3.5 text-stone-300" />
                                <span className={step === 2 ? 'text-amber-700 border-b-2 border-amber-600 pb-0.5' : 'text-stone-400'}>
                                    2. Auth & Shipping
                                </span>
                                <ChevronRight className="size-3.5 text-stone-300" />
                                <span className={step === 3 ? 'text-amber-700 border-b-2 border-amber-600 pb-0.5' : 'text-stone-400'}>
                                    3. Confirmation
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => setActiveProduct(null)}
                                className="rounded-lg p-1 text-stone-400 hover:bg-stone-200 hover:text-stone-700 cursor-pointer"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="overflow-y-auto p-6 flex-1">
                            {/* STEP 1: Customise & Live Canvas Preview */}
                            {step === 1 && (
                                <div className="grid lg:grid-cols-2 gap-8 items-start">
                                    {/* Left: Live Canvas Preview */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-xs font-semibold text-stone-600">
                                            <span>LIVE PRODUCT PREVIEW</span>
                                            <span className="text-amber-700 font-bold uppercase">{activeProduct.category}</span>
                                        </div>
                                        <LiveProductCanvas
                                            product={activeProduct}
                                            photo={uploadedPhoto}
                                            adjustment={adjustment}
                                            onAdjustment={setAdjustment}
                                        />
                                        {uploadedPhoto && (
                                            <div className="flex items-center justify-center gap-2 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setAdjustment({ ...adjustment, zoom: Math.max(0.4, adjustment.zoom / 1.15) })}
                                                    className="rounded-lg border border-stone-200 p-1.5 hover:bg-stone-100"
                                                    title="Zoom Out"
                                                >
                                                    <Minus className="size-4 text-stone-600" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setAdjustment({ ...adjustment, zoom: Math.min(4, adjustment.zoom * 1.15) })}
                                                    className="rounded-lg border border-stone-200 p-1.5 hover:bg-stone-100"
                                                    title="Zoom In"
                                                >
                                                    <Plus className="size-4 text-stone-600" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setAdjustment({ ...adjustment, rotation: adjustment.rotation - 90 })}
                                                    className="rounded-lg border border-stone-200 p-1.5 hover:bg-stone-100"
                                                    title="Rotate Left"
                                                >
                                                    <RotateCcw className="size-4 text-stone-600" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setAdjustment({ ...adjustment, rotation: adjustment.rotation + 90 })}
                                                    className="rounded-lg border border-stone-200 p-1.5 hover:bg-stone-100"
                                                    title="Rotate Right"
                                                >
                                                    <RotateCw className="size-4 text-stone-600" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setAdjustment({ x: 0, y: 0, zoom: 1, rotation: 0, fit: 'fill' })}
                                                    className="rounded-lg border border-stone-200 px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-100"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: Configuration Form */}
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-stone-900">{activeProduct.name}</h3>
                                            <p className="mt-1 text-xs text-stone-600 leading-relaxed">{activeProduct.description}</p>
                                            <div className="mt-3 flex items-baseline gap-2">
                                                <span className="text-2xl font-bold text-stone-900">{money(activeProduct.price, true)}</span>
                                                {activeProduct.customizationPrice > 0 && (
                                                    <span className="text-xs text-stone-500">+ {money(activeProduct.customizationPrice, true)} personalisation</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Dimension / Size */}
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                                                Select Dimension / Size
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {activeProduct.sizes?.map((sz) => (
                                                    <button
                                                        key={sz}
                                                        type="button"
                                                        onClick={() => setSelectedSize(sz)}
                                                        className={`rounded-xl px-4 py-2 text-xs font-semibold border transition-all cursor-pointer ${
                                                            selectedSize === sz
                                                                ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-xs'
                                                                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                                                        }`}
                                                    >
                                                        {sz}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Finish / Material */}
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                                                Select Finish / Material
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {activeProduct.variants?.map((vr) => (
                                                    <button
                                                        key={vr}
                                                        type="button"
                                                        onClick={() => setSelectedVariant(vr)}
                                                        className={`rounded-xl px-4 py-2 text-xs font-semibold border transition-all cursor-pointer ${
                                                            selectedVariant === vr
                                                                ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-xs'
                                                                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                                                        }`}
                                                    >
                                                        {vr}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Upload Photograph */}
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                                                Upload Your Photograph
                                            </label>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                accept="image/*"
                                                onChange={handlePhotoUpload}
                                                className="hidden"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-stone-300 bg-stone-50/50 text-xs font-medium text-stone-700 hover:border-amber-500 hover:bg-amber-50/30 transition-colors cursor-pointer"
                                            >
                                                <Upload className="size-4 text-amber-700" />
                                                {uploadedPhoto ? 'Change Uploaded Photograph' : 'Upload High-Res Image (JPG, PNG)'}
                                            </button>
                                        </div>

                                        {/* Quantity & Continue Button */}
                                        <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-2 border border-stone-200 rounded-xl p-1">
                                                <button
                                                    type="button"
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    className="size-8 rounded-lg flex items-center justify-center hover:bg-stone-100"
                                                >
                                                    <Minus className="size-3.5" />
                                                </button>
                                                <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setQuantity(quantity + 1)}
                                                    className="size-8 rounded-lg flex items-center justify-center hover:bg-stone-100"
                                                >
                                                    <Plus className="size-3.5" />
                                                </button>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => setStep(2)}
                                                className="flex-1 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-amber-600 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-amber-700 transition-colors cursor-pointer"
                                            >
                                                Continue to Auth & Address <ArrowRight className="size-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: Phone Authentication & Address Checkout */}
                            {step === 2 && (
                                <div className="max-w-xl mx-auto space-y-6">
                                    <div className="rounded-xl bg-amber-50/60 border border-amber-200 p-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-stone-900">{activeProduct.name}</p>
                                            <p className="text-[11px] text-stone-500">
                                                Size: {selectedSize} · Finish: {selectedVariant} · Qty: {quantity}
                                            </p>
                                        </div>
                                        <span className="text-sm font-bold text-stone-900">
                                            {money((activeProduct.price + (activeProduct.customizationPrice || 0)) * quantity, true)}
                                        </span>
                                    </div>

                                    {/* 1. Enter Phone Number */}
                                    {!phoneChecked && (
                                        <form onSubmit={handleCheckPhone} className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                                                    Enter Mobile Number to Continue
                                                </label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3.5 top-3 size-4 text-stone-400" />
                                                    <input
                                                        type="tel"
                                                        required
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        placeholder="10-digit mobile number (e.g. 9876543210)"
                                                        className="h-11 w-full rounded-xl border border-stone-300 pl-10 pr-4 text-sm font-medium focus:border-amber-500 focus:outline-none"
                                                    />
                                                </div>
                                            </div>

                                            {authError && <p className="text-xs text-rose-600">{authError}</p>}

                                            <button
                                                type="submit"
                                                className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-stone-900 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-stone-800 transition-colors cursor-pointer"
                                            >
                                                Verify Phone Number <ArrowRight className="size-4" />
                                            </button>
                                        </form>
                                    )}

                                    {/* 2. Existing Customer Password Verification */}
                                    {phoneChecked && existingCustomer && !passwordVerified && (
                                        <form onSubmit={handleVerifyPassword} className="space-y-4">
                                            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                                                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs">
                                                    <CheckCircle2 className="size-4" /> Account Found for {existingCustomer.phone}
                                                </div>
                                                <p className="mt-1 text-xs text-emerald-900">
                                                    Welcome back, <b>{existingCustomer.name}</b>! Please enter your password to proceed.
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                                                    Password *
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3.5 top-3 size-4 text-stone-400" />
                                                    <input
                                                        type="password"
                                                        required
                                                        value={passwordInput}
                                                        onChange={(e) => setPasswordInput(e.target.value)}
                                                        placeholder="Enter your password (default: password)"
                                                        className="h-11 w-full rounded-xl border border-stone-300 pl-10 pr-4 text-sm focus:border-amber-500 focus:outline-none"
                                                    />
                                                </div>
                                            </div>

                                            {authError && <p className="text-xs text-rose-600">{authError}</p>}

                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setPhoneChecked(false)}
                                                    className="h-11 rounded-xl border border-stone-300 px-4 text-xs font-medium text-stone-600"
                                                >
                                                    Change Number
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="flex-1 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-amber-600 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-amber-700 cursor-pointer"
                                                >
                                                    Login & View Address <ArrowRight className="size-4" />
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {/* 3. New Customer Registration Form */}
                                    {phoneChecked && !existingCustomer && !passwordVerified && (
                                        <form onSubmit={handleRegisterAndCheckout} className="space-y-4">
                                            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 text-xs text-amber-900">
                                                New customer registration for <b>{phone}</b>. Fill in your delivery details below:
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[11px] font-semibold uppercase text-stone-700 mb-1">
                                                        Full Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={regForm.name}
                                                        onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                                                        placeholder="e.g. Radhika Sundaram"
                                                        className="h-10 w-full rounded-xl border border-stone-300 px-3 text-xs focus:border-amber-500 focus:outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-semibold uppercase text-stone-700 mb-1">
                                                        Date of Birth (DOB)
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={regForm.dob}
                                                        onChange={(e) => setRegForm({ ...regForm, dob: e.target.value })}
                                                        className="h-10 w-full rounded-xl border border-stone-300 px-3 text-xs focus:border-amber-500 focus:outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-semibold uppercase text-stone-700 mb-1">
                                                        Email (Optional)
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={regForm.email}
                                                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                                                        placeholder="e.g. radhika@example.com"
                                                        className="h-10 w-full rounded-xl border border-stone-300 px-3 text-xs focus:border-amber-500 focus:outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-semibold uppercase text-stone-700 mb-1">
                                                        Pincode *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={regForm.pincode}
                                                        onChange={(e) => setRegForm({ ...regForm, pincode: e.target.value })}
                                                        placeholder="6-digit pincode"
                                                        className="h-10 w-full rounded-xl border border-stone-300 px-3 text-xs focus:border-amber-500 focus:outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold uppercase text-stone-700 mb-1">
                                                    Full Delivery Address *
                                                </label>
                                                <textarea
                                                    rows={2}
                                                    required
                                                    value={regForm.address}
                                                    onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                                                    placeholder="Door No, Street Name, Landmark..."
                                                    className="w-full rounded-xl border border-stone-300 p-3 text-xs focus:border-amber-500 focus:outline-none"
                                                />
                                            </div>

                                            {authError && <p className="text-xs text-rose-600">{authError}</p>}

                                            <button
                                                type="submit"
                                                className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-amber-600 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-amber-700 transition-colors cursor-pointer"
                                            >
                                                Save Profile & Continue <ArrowRight className="size-4" />
                                            </button>
                                        </form>
                                    )}

                                    {/* 4. Authenticated Saved Address & Payment Selection */}
                                    {passwordVerified && existingCustomer && (
                                        <div className="space-y-6">
                                            {/* Saved Customer Address Card */}
                                            <div className="rounded-2xl border border-stone-200/80 bg-stone-50 p-5 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="size-4 text-amber-700" />
                                                        <h4 className="font-bold text-stone-900 text-sm">Delivery Address</h4>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsEditingAddress(!isEditingAddress)}
                                                        className="text-xs font-semibold text-amber-700 hover:underline cursor-pointer"
                                                    >
                                                        {isEditingAddress ? 'Done Editing' : 'Edit Address'}
                                                    </button>
                                                </div>

                                                {!isEditingAddress ? (
                                                    <div className="text-xs text-stone-700 space-y-1">
                                                        <p className="font-semibold text-stone-900">{existingCustomer.name}</p>
                                                        <p>{existingCustomer.address}</p>
                                                        <p>
                                                            {existingCustomer.city}, {existingCustomer.state} - {existingCustomer.pincode}
                                                        </p>
                                                        <p className="text-stone-500 font-mono">Mobile: {existingCustomer.phone}</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2 pt-2">
                                                        <input
                                                            type="text"
                                                            value={existingCustomer.name}
                                                            onChange={(e) =>
                                                                setExistingCustomer({ ...existingCustomer, name: e.target.value })
                                                            }
                                                            className="h-9 w-full rounded-lg border border-stone-300 px-3 text-xs bg-white"
                                                            placeholder="Full Name"
                                                        />
                                                        <textarea
                                                            rows={2}
                                                            value={existingCustomer.address}
                                                            onChange={(e) =>
                                                                setExistingCustomer({ ...existingCustomer, address: e.target.value })
                                                            }
                                                            className="w-full rounded-lg border border-stone-300 p-2 text-xs bg-white"
                                                            placeholder="Street address"
                                                        />
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <input
                                                                type="text"
                                                                value={existingCustomer.city}
                                                                onChange={(e) =>
                                                                    setExistingCustomer({ ...existingCustomer, city: e.target.value })
                                                                }
                                                                className="h-9 rounded-lg border border-stone-300 px-3 text-xs bg-white"
                                                                placeholder="City"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={existingCustomer.pincode}
                                                                onChange={(e) =>
                                                                    setExistingCustomer({ ...existingCustomer, pincode: e.target.value })
                                                                }
                                                                className="h-9 rounded-lg border border-stone-300 px-3 text-xs bg-white"
                                                                placeholder="Pincode"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Payment Options */}
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                                                    Select Payment Method
                                                </label>
                                                <div className="grid sm:grid-cols-2 gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setPaymentMethod('Razorpay Online')}
                                                        className={`flex items-center gap-3 rounded-xl border p-4 text-left cursor-pointer transition-all ${
                                                            paymentMethod === 'Razorpay Online'
                                                                ? 'border-amber-600 bg-amber-50/70 shadow-xs'
                                                                : 'border-stone-200 bg-white hover:bg-stone-50'
                                                        }`}
                                                    >
                                                        <CreditCard className="size-5 text-amber-700" />
                                                        <div>
                                                            <p className="text-xs font-bold text-stone-900">Razorpay / UPI Online</p>
                                                            <p className="text-[10px] text-stone-500">Instant test checkout</p>
                                                        </div>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPaymentMethod('Cash on Delivery')}
                                                        className={`flex items-center gap-3 rounded-xl border p-4 text-left cursor-pointer transition-all ${
                                                            paymentMethod === 'Cash on Delivery'
                                                                ? 'border-amber-600 bg-amber-50/70 shadow-xs'
                                                                : 'border-stone-200 bg-white hover:bg-stone-50'
                                                        }`}
                                                    >
                                                        <ShieldCheck className="size-5 text-amber-700" />
                                                        <div>
                                                            <p className="text-xs font-bold text-stone-900">Cash on Delivery</p>
                                                            <p className="text-[10px] text-stone-500">Pay on studio delivery</p>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleCompleteOrder}
                                                className="w-full inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-amber-600 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:bg-amber-700 transition-colors cursor-pointer"
                                            >
                                                Confirm Order · {money((activeProduct.price + (activeProduct.customizationPrice || 0)) * quantity, true)}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* STEP 3: Order Confirmation */}
                            {step === 3 && createdOrder && (
                                <div className="text-center py-10 space-y-4 max-w-md mx-auto">
                                    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                        <Check className="size-9" />
                                    </div>
                                    <h3 className="font-display text-2xl font-bold text-stone-900">Order Placed Successfully!</h3>
                                    <p className="text-xs text-stone-600 leading-relaxed">
                                        Order <b>#{createdOrder.id}</b> for <b>{activeProduct.name}</b> has been received and routed to our bindery lab.
                                    </p>
                                    <div className="rounded-xl bg-stone-50 p-4 border border-stone-200 text-left text-xs space-y-1">
                                        <p className="font-semibold text-stone-900">Customer: {createdOrder.customer.name}</p>
                                        <p>Mobile: {createdOrder.customer.mobile}</p>
                                        <p>Address: {createdOrder.customer.address}, {createdOrder.customer.city}</p>
                                        <p className="pt-2 font-bold text-stone-900">Payment: {createdOrder.payment}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setActiveProduct(null)}
                                        className="inline-flex h-11 items-center justify-center px-6 rounded-xl bg-stone-900 text-white font-semibold text-xs uppercase tracking-wider hover:bg-stone-800 cursor-pointer"
                                    >
                                        Back to Storefront
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
