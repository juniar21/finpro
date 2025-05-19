import React from "react";

const styles = [
  { title: "Casual", img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80" },
  { title: "Formal", img: "https://images.unsplash.com/photo-1520975693825-35dbb8c7c7d7?auto=format&fit=crop&w=400&q=80" },
  { title: "Party", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80" },
  { title: "Gym", img: "https://images.unsplash.com/photo-1536305031683-c44828a9e3cc?auto=format&fit=crop&w=400&q=80" },
];

export default function BrowseByDressStyle() {
  return (
    <div className="bg-gray-100 rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="font-bold text-center mb-6 text-lg md:text-xl">BROWSE BY DRESS STYLE</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Item 1 */}
        <div className="relative rounded-lg overflow-hidden bg-white shadow">
          <img src={styles[0].img} alt={styles[0].title} className="w-full h-36 object-cover" />
          <span className="absolute top-2 left-2 bg-white bg-opacity-70 px-3 py-1 rounded text-sm font-semibold">{styles[0].title}</span>
        </div>

        {/* Item 2 */}
        <div className="relative rounded-lg overflow-hidden bg-white shadow">
          <img src={styles[1].img} alt={styles[1].title} className="w-full h-36 object-cover" />
          <span className="absolute top-2 left-2 bg-white bg-opacity-70 px-3 py-1 rounded text-sm font-semibold">{styles[1].title}</span>
        </div>

        {/* Item 3 */}
        <div className="relative rounded-lg overflow-hidden bg-white shadow">
          <img src={styles[2].img} alt={styles[2].title} className="w-full h-36 object-cover" />
          <span className="absolute top-2 left-2 bg-white bg-opacity-70 px-3 py-1 rounded text-sm font-semibold">{styles[2].title}</span>
        </div>

        {/* Item 4 */}
        <div className="relative rounded-lg overflow-hidden bg-white shadow">
          <img src={styles[3].img} alt={styles[3].title} className="w-full h-36 object-cover" />
          <span className="absolute top-2 left-2 bg-white bg-opacity-70 px-3 py-1 rounded text-sm font-semibold">{styles[3].title}</span>
        </div>
      </div>
    </div>
  );
}
