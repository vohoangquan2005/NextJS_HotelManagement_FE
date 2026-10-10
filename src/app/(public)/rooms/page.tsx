import RoomList from "@/components/rooms/RoomList";

export default function RoomPage() {
    return (
        <main className="min-h-screen bg-background">
            <section className="bg-muted/40">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <p className="text-sm font-medium text-primary">
                        KHÁM PHÁ PHÒNG NGHỈ
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                        Danh sách phòng
                    </h1>

                    <p className="mt-3 max-w-2xl text-muted-foreground">
                        Tìm phòng phù hợp với nhu cầu và ngân sách của bạn.
                    </p>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <RoomList />
            </div>
        </main>
    );
}