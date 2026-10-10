"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Hotel,
  Menu,
  LogOut,
  User,
  LayoutDashboard,
  CalendarCheck,
  ChevronDown,
  ShieldCheck,
  LockKeyhole,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Trang chủ", href: "/" },
  { label: "Phòng nghỉ", href: "/rooms" },
  { label: "Dịch vụ", href: "/service" },
];

export default function PublicHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LOGO KHÁCH SẠN */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3 transition-transform hover:scale-[1.02]"
          aria-label="HotelStay - Trang chủ"
        >
          {/* Khối Logo giả lập kèm ghi chú trực quan */}
          <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white shadow-md shadow-amber-500/20">
            <Hotel className="size-6 transition-transform group-hover:rotate-6" />
            <span
              className="sr-only"
              title="ĐÂY LÀ LOGO KHÁCH SẠN"
            >
              ĐÂY LÀ LOGO KHÁCH SẠN
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-foreground">
                HotelStay
              </span>
              <span className="hidden rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 sm:inline-block dark:text-amber-400">
                Luxury
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground leading-none">
              [ĐÂY LÀ LOGO KHÁCH SẠN]
            </span>
          </div>
        </Link>

        {/* MENU ĐIỀU HƯỚNG DESKTOP */}
        <nav
          aria-label="Điều hướng chính"
          className="hidden items-center gap-1 md:flex"
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Đường dẫn tới đặt phòng của tôi nếu là Customer đã đăng nhập */}
          {user && user.roleName === "Customer" && (
            <Link
              href="/bookings"
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${pathname.startsWith("/bookings")
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
            >
              Đặt phòng của tôi
            </Link>
          )}

          {/* Đường dẫn nhanh tới bảng điều khiển quản trị nếu là Admin */}
          {user && user.roleName === "Admin" && (
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
            >
              <ShieldCheck className="size-3.5" />
              Khu vực Quản trị
            </Link>
          )}

          {/* Đường dẫn nhanh tới bảng điều khiển nếu là Staff */}
          {user && user.roleName === "Staff" && (
            <Link
              href="/staff/dashboard"
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800"
            >
              <LayoutDashboard className="size-3.5" />
              Khu vực Nhân viên
            </Link>
          )}
        </nav>

        {/* TÀI KHOẢN / AUTH DESKTOP */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoading ? (
            <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            /* TRẠNG THÁI: ĐÃ ĐĂNG NHẬP */
            <div className="flex items-center gap-2">
              {/* Thay nút Đăng ký bằng: Xin chào, [tên người dùng] */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 font-medium px-3 text-sm hover:bg-accent cursor-pointer"
                    >
                      <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="size-4" />
                      </div>
                      <span className="max-w-[150px] truncate text-foreground font-semibold">
                        Xin chào, {user.fullName}
                      </span>
                      <ChevronDown className="size-3.5 text-muted-foreground" />
                    </Button>
                  }
                />

                <DropdownMenuContent align="end" className="w-56 p-2">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none text-foreground">
                          {user.fullName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                        <span className="mt-1 inline-flex w-fit items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          Vai trò: {user.roleName}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  {/* Chức năng dùng chung cho mọi vai trò */}
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <User className="size-4 text-primary" />
                    <span>Hồ sơ cá nhân</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => router.push("/change-password")}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <LockKeyhole className="size-4 text-primary" />
                    <span>Đổi mật khẩu</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  {/* Mục điều hướng nhanh theo vai trò */}
                  {user.roleName === "Admin" && (
                    <DropdownMenuItem
                      onClick={() => router.push("/admin/dashboard")}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <LayoutDashboard className="size-4 text-amber-600" />
                      <span>Bảng điều khiển Quản trị</span>
                    </DropdownMenuItem>
                  )}

                  {user.roleName === "Staff" && (
                    <DropdownMenuItem
                      onClick={() => router.push("/staff/dashboard")}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <LayoutDashboard className="size-4 text-blue-600" />
                      <span>Bảng điều khiển Nhân viên</span>
                    </DropdownMenuItem>
                  )}

                  {user.roleName === "Customer" && (
                    <DropdownMenuItem
                      onClick={() => router.push("/bookings")}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <CalendarCheck className="size-4 text-primary" />
                      <span>Lịch sử đặt phòng</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex cursor-pointer items-center gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <LogOut className="size-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Thay nút Đăng nhập bằng: Nút Đăng xuất */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-1.5 text-muted-foreground hover:text-destructive hover:border-destructive/40 cursor-pointer"
              >
                <LogOut className="size-4" />
                <span>Đăng xuất</span>
              </Button>
            </div>
          ) : (
            /* TRẠNG THÁI: CHƯA ĐĂNG NHẬP */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Đăng nhập
              </Link>

              <Link
                href="/register"
                className={buttonVariants({ variant: "default", size: "sm" })}
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>

        {/* MENU MOBILE */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Mở menu điều hướng"
                >
                  <Menu className="size-5" />
                </Button>
              }
            />

            <SheetContent side="right" className="w-[300px] sm:w-[360px] p-6">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-left">
                  <Hotel className="size-6 text-primary" />
                  <div>
                    <span className="font-bold">HotelStay</span>
                    <span className="block text-[10px] font-normal text-muted-foreground">
                      [ĐÂY LÀ LOGO KHÁCH SẠN]
                    </span>
                  </div>
                </SheetTitle>
              </SheetHeader>

              {/* Thông tin người dùng mobile nếu đã đăng nhập */}
              {user && (
                <div className="mt-4 rounded-xl border bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">Đang đăng nhập:</p>
                  <p className="font-semibold text-foreground text-sm">
                    Xin chào, {user.fullName}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <span className="mt-1 inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    Vai trò: {user.roleName}
                  </span>
                </div>
              )}

              <nav
                aria-label="Điều hướng trên điện thoại"
                className="mt-6 flex flex-col gap-2"
              >
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    {item.label}
                  </Link>
                ))}

                {user && user.roleName === "Customer" && (
                  <Link
                    href="/bookings"
                    className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    Đặt phòng của tôi
                  </Link>
                )}

                {user && user.roleName === "Admin" && (
                  <Link
                    href="/admin/dashboard"
                    className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300"
                  >
                    Trang quản trị (Admin)
                  </Link>
                )}

                {user && user.roleName === "Staff" && (
                  <Link
                    href="/staff/dashboard"
                    className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300"
                  >
                    Trang nhân viên (Staff)
                  </Link>
                )}

                <div className="my-2 border-t" />

                {user ? (
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="w-full gap-2 cursor-pointer"
                  >
                    <LogOut className="size-4" />
                    Đăng xuất
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/login"
                      className={buttonVariants({ variant: "outline", className: "w-full justify-center" })}
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      href="/register"
                      className={buttonVariants({ className: "w-full justify-center" })}
                    >
                      Đăng ký
                    </Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}