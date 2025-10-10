import { FOOTER_LINK_GROUPS } from "@/config/links";

export default function Footer() {
	return (
		<footer className="bg-black text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-14">
				{/* Main content area */}
				<div className="flex justify-between items-start mb-8 sm:mb-14">
					{/* Logo section */}
					<div className="flex items-bet">
						{/* Logo image */}
						<img 
							src="/images/Group 1 1.png" 
							alt="UNCTRL Logo" 
							className="w-90  sm:w-80 lg:w-150 lg:h-45 rotate-270 sm:rotate-0 translate-y-30 sm:translate-y-0
							translate-x-[-90px] sm:translate-x-0
							"
						/>
					</div>

					{/* Navigation sections */}
					<div className="flex flex-col sm:flex-row gap-8 sm:gap-12 lg:gap-24 text-lg sm:text-xl">
						{FOOTER_LINK_GROUPS.map((group) => (
							<div key={group.title} className="space-y-3 sm:space-y-4 text-right sm:text-left">
								{group.links.map((link) => (
									<a
										key={`${group.title}-${link.label}`}
										href={link.href}
										className="block hover:text-orange-500 transition-colors"
										// All footer links open in same tab as requested
									>
										{link.label}
									</a>
								))}
							</div>
						))}
					</div>
				</div>

				{/* Bottom navigation */}
				<div className="border-t border-gray-800 pt-6 sm:pt-8">
					<div className="flex flex-row sm:gap-12 text-sm sm:text-base text-gray-400 text-center sm:text-left mb-15 sm:m-0 gap-4 sm:gap-8 lg:gap-12 justify-center sm:justify-start">
						<a href={"https://gameunctrl.com/pages/faqs"} className="hover:text-white transition-colors">FAQs</a>
						<a href={"https://gameunctrl.com/pages/support"} className="hover:text-white transition-colors">Support</a>
						<a href={"https://gameunctrl.com/pages/privacy-policy"} className="hover:text-white transition-colors">Privacy policy</a>
						<a href={"https://gameunctrl.com/pages/terms-conditions"} className="hover:text-white transition-colors">Terms and conditions</a>
					</div>
				</div>
			</div>
		</footer>
	);
}