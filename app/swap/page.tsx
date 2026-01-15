
import { SwapCard } from "@/components/SwapCard";

export default function SwapPage() {
    return (
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[80vh]">
            <div className="text-center mb-10 space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                    代币兑换中心 🪙
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                    使用 ETH 兑换平台原生代币 $BLG，用于打赏优质文章作者。
                    <br />
                    <span className="text-sm text-gray-400">(测试网环境，无需真实资金)</span>
                </p>
            </div>

            <SwapCard />
        </div>
    );
}
