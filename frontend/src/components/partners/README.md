# Partners Section Component

Komponen untuk menampilkan logo partner/sponsor dengan efek marquee (auto-sliding) yang smooth.

## Features

- ✨ **Infinite Marquee Animation** - Logo partner bergerak secara kontinyu dari kanan ke kiri
- 🎨 **Hover to Pause** - Animasi berhenti saat cursor hover untuk melihat logo lebih jelas
- 🖼️ **Grayscale Effect** - Logo ditampilkan grayscale dan berubah full color saat hover
- 📱 **Fully Responsive** - Tampilan optimal di semua ukuran layar
- ⚡ **Optimized Performance** - Menggunakan CSS animation untuk performa maksimal
- 🔧 **Easy to Configure** - Data partner disimpan di file terpisah untuk kemudahan maintenance

## Usage

```tsx
import { PartnersSection } from "@/components/partners";

function HomePage() {
  return (
    <div>
      {/* Your other content */}
      <PartnersSection />
      {/* Footer */}
    </div>
  );
}
```

## Data Configuration

Partner data disimpan di `src/data/partnersData.ts`:

```typescript
export interface Partner {
  id: number;
  name: string;
  logo: string;
  website?: string;
}

export const partnersData: Partner[] = [
  {
    id: 1,
    name: "Bank BNI",
    logo: "https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/1200px-BNI_logo.svg.png",
    website: "https://www.bni.co.id",
  },
  // ... more partners
];
```

## Customization

### Animation Speed

Ubah durasi animasi di inline `<style>`:

```css
.animate-marquee {
  animation: marquee 40s linear infinite; /* Ubah 40s sesuai keinginan */
}
```

- Durasi lebih kecil = animasi lebih cepat
- Durasi lebih besar = animasi lebih lambat

### Logo Size

Ubah ukuran logo container:

```tsx
<div className="flex-shrink-0 w-48 h-24 ...">
  {/* w-48 = width, h-24 = height */}
</div>
```

### Gap Between Logos

Ubah spacing antar logo:

```tsx
<div className="flex gap-8 ...">
  {/* gap-8 = 2rem spacing */}
</div>
```

## Styling Classes

- `grayscale` - Membuat logo hitam putih
- `opacity-60` - Transparansi 60%
- `group-hover:grayscale-0` - Hilangkan grayscale saat hover
- `group-hover:opacity-100` - Full opacity saat hover
- `transition-all duration-300` - Smooth transition 300ms

## Tips

1. **Gunakan logo dengan background transparan** (PNG/SVG) untuk hasil terbaik
2. **Ukuran file logo** - Optimalkan ukuran logo untuk loading yang cepat
3. **Aspect ratio** - Pastikan logo memiliki aspect ratio yang konsisten
4. **Jumlah partner** - Minimal 8-10 partner untuk efek marquee yang smooth

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Performance Notes

- Menggunakan `will-change: transform` untuk optimasi GPU
- `loading="lazy"` pada image untuk lazy loading
- CSS animation lebih performant dibanding JavaScript animation