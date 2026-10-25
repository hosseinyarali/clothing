import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  // فعلاً ساده: یک فلگ در localStorage
  const isAdmin = localStorage.getItem('admin') === 'true';
  if (isAdmin) return true;
  router.navigate(['/admin/login']);
  return false;
};
