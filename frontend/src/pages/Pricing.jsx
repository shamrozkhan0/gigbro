import {
  Wifi,
  BarChart3,
  Sparkles,
} from "lucide-react";

const Pricing = () => {
  return (
    <section className=" bg-white px-6 py-16" id="pricing">
      <div className="mx-auto mb-14 max-w-6xl text-center">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-6xl">
          Choose Your{" "}
          <span className="text-green-600">Plan</span>
        </h2>

        <div className="mt-6 flex items-center justify-center gap-6">
          <div className="hidden h-px w-20 bg-slate-200 sm:block" />

          <p className="text-lg font-medium text-slate-500 md:text-xl">
            Simple pricing. More value. Better gigs.
          </p>

          <div className="hidden h-px w-20 bg-slate-200 sm:block" />
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Buddy Plan */}
        <div className="relative h-fit overflow-hidden rounded-[38px]
           bg-gradient-to-br from-green-500 via-green-600 to-green-800 p-10 text-white shadow-2xl">
          {/* Top Section */}
          <div className="flex items-start justify-between">
            {/* <div className="flex h-14 w-14 items-center justify-center rounded-full border-[6px] border-white">
                <span className="text-3xl font-black">G</span>
              </div> */}

            <div>
              <h3 className="text-4xl font-extrabold tracking-tight">
                BUDDY
              </h3>

            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">
                $0
              </span>

              <span className="text-lg text-white/70">
                /month
              </span>
            </div>


          </div>

          {/* Contactless Icon */}
          <div className="absolute right-10 top-30">
            <Wifi
              size={28}
              strokeWidth={3}
              className="rotate-90"
            />
          </div>

          {/* Main Content */}
          <div className="mt-10">
            {/* <h4 className="text-xl font-bold tracking-tight">
              Buddy
            </h4> */}

            <p className="mt-2 text-md text-white/80">
              For sellers getting started
            </p>

            <div className="my-8 h-px w-full bg-white/40" />

            {/* Feature */}
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/40 bg-green-700/30">
                <BarChart3
                  size={32}
                  strokeWidth={2.5}
                />
              </div>

              <div className="flex items-center gap-4">
                <span className="text-5xl font-extrabold">
                  3
                </span>

                <div>
                  <p className="text-xl font-bold">
                    Lite <br /> Reports
                  </p>
                  <p className="text-lg text-white/75">
                    per month
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Buddy Plan */}
        <div className="relative h-fit overflow-hidden rounded-[38px] bg-gradient-to-br from-slate-900 via-slate-950 to-[#071b13] p-10 text-white shadow-2xl">
          {/* Top Section */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* <div className="flex h-14 w-14 items-center justify-center rounded-full border-[6px] border-green-500">
                <span className="text-3xl font-black text-green-500">
                  G
                </span>
              </div> */}

              <div>
                <h3 className="text-4xl font-bold tracking-tight">
                  PRO BUDDY
                </h3>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">
                $3
              </span>

              <span className="text-lg text-white/70">
                /month
              </span>
            </div>
          </div>

          {/* Contactless Icon */}
          <div className="absolute right-10 top-30">
            <Wifi
              size={28}
              strokeWidth={3}
              className="rotate-90"
            />
          </div>

          {/* Main Content */}
          <div className="mt-10">
            {/* <h4 className="text-2xl font-bold tracking-tight">
              <span className="text-green-500">Pro</span>{" "}
              Buddy
            </h4> */}

            <p className="mt-4 text-md text-white/80">
              For serious sellers <br className="block sm:hidden"/> who want to rank higher
            </p>

            <div className="my-8 h-px w-full bg-white/30" />

            {/* Features */}
            <div className="flex items-center gap-7 flex-col sm:flex-row justify-between">
              {/* Lite Reports */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-green-500/60 bg-green-950/30">
                  <BarChart3
                    size={32}
                    className="text-green-500"
                    strokeWidth={2.5}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-5xl font-extrabold">
                    5
                  </span>

                  <div>
                    <p className="text-lg font-bold">
                      Lite Reports
                    </p>
                    <p className="text-base text-white/70">
                      per month
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-20 w-px bg-white/30" />

              {/* Pro Analyzes */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-green-500/60 bg-green-950/30">
                  <Sparkles
                    size={32}
                    className="text-green-400"
                    strokeWidth={2.5}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-5xl font-extrabold">
                    3
                  </span>

                  <div>
                    <p className="text-lg font-bold">
                      Pro Analyzes
                    </p>
                    <p className="text-base text-white/70">
                      per month
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;