import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  label: string;
  icon: string;
  link?: string;
  exact?: boolean;
  soon?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface QuickAction {
  icon: string;
  title: string;
  desc: string;
  link: string;
}

interface SoonFeature {
  icon: string;
  title: string;
  desc: string;
}

interface Stat {
  label: string;
  icon: string;
  value: number | null; // وقتی null باشه «—» نشون داده می‌شه
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {

  // منوی کناری
  navGroups: NavGroup[] = [
    {
      title: 'عمومی',
      items: [
        { label: 'داشبورد', icon: '🏠', link: '/admin', exact: true }
      ]
    },
    {
      title: 'فروشگاه',
      items: [
        { label: 'لیست محصولات', icon: '📦', link: '/admin/products', exact: true },
        { label: 'افزودن محصول', icon: '➕', link: '/admin/products/new' },
        { label: 'دسته‌بندی‌ها', icon: '🏷️', link: '/admin/categories' },
        { label: 'سفارش‌ها', icon: '🛒', link: '/admin/orders' }
      ]
    },
    {
      title: 'به‌زودی',
      items: [
        { label: 'کاربران', icon: '👥', soon: true },
        { label: 'کوپن و تخفیف', icon: '🎟️', soon: true },
        { label: 'گزارش فروش', icon: '📈', soon: true },
        { label: 'موجودی انبار', icon: '🏬', soon: true },
        { label: 'نظرات مشتریان', icon: '💬', soon: true },
        { label: 'تنظیمات', icon: '⚙️', soon: true }
      ]
    }
  ];

  // آمار: مقدارها رو بعداً از سرویس‌ها پر کن
  stats = signal<Stat[]>([
    { label: 'محصولات', icon: '📦', value: null },
    { label: 'دسته‌بندی‌ها', icon: '🏷️', value: null },
    { label: 'سفارش‌های جدید', icon: '🛒', value: null },
    { label: 'فروش امروز', icon: '💰', value: null }
  ]);

  quickActions: QuickAction[] = [
    { icon: '➕', title: 'افزودن محصول', desc: 'ایجاد محصول جدید با واریانت‌های سایز و رنگ', link: '/admin/products/new' },
    { icon: '📦', title: 'لیست محصولات', desc: 'مشاهده، ویرایش و حذف محصولات', link: '/admin/products' },
    { icon: '🛒', title: 'سفارش‌ها', desc: 'مشاهده و مدیریت وضعیت سفارش‌ها', link: '/admin/orders' },
    { icon: '🏷️', title: 'دسته‌بندی‌ها', desc: 'افزودن، ویرایش و حذف دسته‌بندی‌ها', link: '/admin/categories' }
  ];

  soonFeatures: SoonFeature[] = [
    { icon: '📈', title: 'گزارش فروش', desc: 'نمودار فروش روزانه، ماهانه و پرفروش‌ترین محصولات' },
    { icon: '🎟️', title: 'کوپن و تخفیف', desc: 'ساخت کد تخفیف و کمپین‌های فصلی' },
    { icon: '🏬', title: 'موجودی انبار', desc: 'هشدار کمبود موجودی برای هر سایز و رنگ' },
    { icon: '👥', title: 'کاربران', desc: 'مدیریت مشتریان و سابقه خرید آن‌ها' },
    { icon: '💬', title: 'نظرات مشتریان', desc: 'بررسی و تأیید نظرات ثبت‌شده روی محصولات' },
    { icon: '⚙️', title: 'تنظیمات فروشگاه', desc: 'اطلاعات فروشگاه، هزینه ارسال و درگاه پرداخت' }
  ];
}
