import clsx from 'clsx';
import { apiAsset, type PortfolioItem } from '../services/siteService';

export function PortfolioGrid({
    items,
    onOpen,
}: {
    items: PortfolioItem[];
    onOpen?: (index: number) => void;
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {items.map((item, index) => {
                const isSpanTwo = index === 0 || index === 5;
                return (
                    <article
                        key={item.id}
                        className={clsx(
                            'group relative overflow-hidden bg-stone-100 transition-all duration-500 cursor-pointer',
                            isSpanTwo ? 'md:col-span-2 aspect-[16/10]' : 'aspect-[4/5]',
                        )}
                    >
                        <button
                            type="button"
                            onClick={() => onOpen?.(index)}
                            className="block size-full cursor-zoom-in text-left focus:outline-none"
                            aria-label={`View photo: ${item.title}`}
                        >
                            <img
                                src={apiAsset(item.image_url)}
                                alt={item.title}
                                loading="lazy"
                                className="protected-img size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                onContextMenu={(e) => e.preventDefault()}
                                draggable={false}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-6 text-white">
                                <span className="text-[10px] sm:text-xs font-sans font-light tracking-[0.3em] uppercase text-[#e0cca7]">
                                    {item.category}
                                </span>
                                <h3 className="mt-1 font-serif text-lg sm:text-xl font-normal leading-snug">
                                    {item.title}
                                </h3>
                                {item.description && (
                                    <p className="mt-1 font-serif italic text-xs text-stone-300 line-clamp-2">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        </button>
                    </article>
                );
            })}
        </div>
    );
}
