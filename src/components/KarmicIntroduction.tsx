import React from "react";
import { motion } from "framer-motion";

export const KarmicIntroduction = () => {
	return (
		<div className="max-w-4xl mx-auto p-4">
			{/* Introduction Card */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="mb-8 flex justify-center"
			>
				<div className="relative w-full max-w-sm h-[500px] bg-[#8B4513] rounded-2xl border-2 border-[#d4bc8b] overflow-hidden flex flex-col items-center justify-between p-6">
					{/* Stars and Mandala SVG */}
					<svg
						width="240"
						height="240"
						viewBox="0 0 240 240"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="mt-8"
					>
						{/* Large center star */}
						<path
							d="M120 10L126 40H156L132 60L138 90L120 70L102 90L108 60L84 40H114L120 10Z"
							fill="white"
						/>

						{/* Small stars */}
						<path
							d="M60 50L63 65H78L66 75L69 90L60 80L51 90L54 75L42 65H57L60 50Z"
							fill="white"
						/>
						<path
							d="M180 70L183 85H198L186 95L189 110L180 100L171 110L174 95L162 85H177L180 70Z"
							fill="white"
						/>

						{/* Mandala */}
						<circle cx="120" cy="140" r="70" fill="#f5f5dc" />
						<circle
							cx="120"
							cy="140"
							r="65"
							stroke="#d4bc8b"
							strokeWidth="1"
							fill="none"
						/>

						{/* Grid pattern */}
						<line
							x1="70"
							y1="140"
							x2="170"
							y2="140"
							stroke="#d4bc8b"
							strokeWidth="1"
						/>
						<line
							x1="120"
							y1="90"
							x2="120"
							y2="190"
							stroke="#d4bc8b"
							strokeWidth="1"
						/>

						{/* Boxes */}
						<rect
							x="85"
							y="105"
							width="30"
							height="30"
							stroke="#d4bc8b"
							strokeWidth="1"
							fill="none"
						/>
						<rect
							x="125"
							y="105"
							width="30"
							height="30"
							stroke="#d4bc8b"
							strokeWidth="1"
							fill="none"
						/>
						<rect
							x="85"
							y="145"
							width="30"
							height="30"
							stroke="#d4bc8b"
							strokeWidth="1"
							fill="none"
						/>
						<rect
							x="125"
							y="145"
							width="30"
							height="30"
							stroke="#d4bc8b"
							strokeWidth="1"
							fill="none"
						/>

						{/* Center element */}
						<rect
							x="105"
							y="125"
							width="30"
							height="30"
							fill="#8B4513"
							stroke="#d4bc8b"
							strokeWidth="1"
						/>
						<path
							d="M120 130L123 138H132L125 143L128 150L120 145L112 150L115 143L108 138H117L120 130Z"
							fill="#f5f5dc"
						/>
					</svg>

					{/* Title at bottom */}
					<div className="bg-[#f5f5dc] px-12 py-2 rounded-md mb-4">
						<h2 className="text-2xl font-serif text-[#8B4513] tracking-wider">
							INTRODUÇÃO
						</h2>
					</div>
				</div>
			</motion.div>

			{/* Welcome Card */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className="mb-8 flex justify-center"
			>
				<div className="relative w-full max-w-sm h-[500px] bg-white rounded-2xl border border-[#d4bc8b] overflow-hidden flex flex-col items-center p-8">
					<h1 className="text-2xl font-serif text-[#8B4513] mb-6 tracking-wider text-center">
						MAPA MATRIZ KÁRMICA
						<br />
						PESSOAL 2025
					</h1>

					<div className="space-y-6 text-[#8B4513] text-center flex-grow">
						<p className="text-lg font-medium">
							Bem-vindo ao Mapa Matriz Kármica
							<br />
							Pessoal 2025!
						</p>

						<p className="text-base">
							Este guia ilumina sua jornada espiritual,
							<br />
							revelando karmas, bloqueios e desafios
							<br />e suas influências atuais.
						</p>

						<p className="text-base">
							Descubra insights para transformação
							<br />
							pessoal e autoconhecimento.
						</p>
					</div>

					{/* Decorative elements at bottom */}
					<svg
						width="200"
						height="20"
						viewBox="0 0 200 20"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="mt-auto mb-4"
					>
						<circle cx="70" cy="10" r="3" fill="#d4bc8b" />
						<circle cx="130" cy="10" r="3" fill="#d4bc8b" />
						<line
							x1="10"
							y1="10"
							x2="60"
							y2="10"
							stroke="#d4bc8b"
							strokeWidth="1"
						/>
						<line
							x1="140"
							y1="10"
							x2="190"
							y2="10"
							stroke="#d4bc8b"
							strokeWidth="1"
						/>
					</svg>
				</div>
			</motion.div>

			{/* Main Title Card */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.4 }}
				className="flex justify-center"
			>
				<div className="relative w-full max-w-sm h-[500px] bg-[#8B4513] rounded-2xl border border-[#d4bc8b] overflow-hidden flex flex-col items-center p-6">
					<div className="mb-4 text-center">
						<h1 className="text-3xl font-serif text-[#d4bc8b] mt-4 tracking-wider">
							MAPA MATRIZ
							<br />
							KÁRMICA
							<br />
							PESSOAL 2025
						</h1>
					</div>

					{/* Sacred Geometry SVG - Metatron's Cube */}
					<svg
						width="280"
						height="280"
						viewBox="0 0 280 280"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="mt-4"
					>
						{/* Background gradient */}
						<defs>
							<radialGradient
								id="paint0_radial"
								cx="0"
								cy="0"
								r="1"
								gradientUnits="userSpaceOnUse"
								gradientTransform="translate(140 140) rotate(90) scale(140)"
							>
								<stop offset="0" stopColor="#d4bc8b" stopOpacity="0.3" />
								<stop offset="0.7" stopColor="#3a2a18" />
								<stop offset="1" stopColor="#000000" />
							</radialGradient>
						</defs>

						{/* Background circle */}
						<circle cx="140" cy="140" r="140" fill="url(#paint0_radial)" />

						{/* Outer circles */}
						<circle
							cx="140"
							cy="140"
							r="130"
							stroke="#d4bc8b"
							strokeWidth="1"
							strokeOpacity="0.3"
						/>
						<circle
							cx="140"
							cy="140"
							r="110"
							stroke="#d4bc8b"
							strokeWidth="1"
							strokeOpacity="0.4"
						/>

						{/* Metatron's Cube */}
						{/* Center circle */}
						<circle
							cx="140"
							cy="140"
							r="20"
							stroke="#d4bc8b"
							strokeWidth="1.5"
							fill="none"
						/>
						<circle cx="140" cy="140" r="5" fill="#d4bc8b" />

						{/* Surrounding circles */}
						<circle
							cx="140"
							cy="80"
							r="15"
							stroke="#d4bc8b"
							strokeWidth="1"
							fill="none"
						/>
						<circle
							cx="140"
							cy="200"
							r="15"
							stroke="#d4bc8b"
							strokeWidth="1"
							fill="none"
						/>
						<circle
							cx="80"
							cy="140"
							r="15"
							stroke="#d4bc8b"
							strokeWidth="1"
							fill="none"
						/>
						<circle
							cx="200"
							cy="140"
							r="15"
							stroke="#d4bc8b"
							strokeWidth="1"
							fill="none"
						/>
						<circle
							cx="95"
							cy="95"
							r="15"
							stroke="#d4bc8b"
							strokeWidth="1"
							fill="none"
						/>
						<circle
							cx="185"
							cy="95"
							r="15"
							stroke="#d4bc8b"
							strokeWidth="1"
							fill="none"
						/>
						<circle
							cx="95"
							cy="185"
							r="15"
							stroke="#d4bc8b"
							strokeWidth="1"
							fill="none"
						/>
						<circle
							cx="185"
							cy="185"
							r="15"
							stroke="#d4bc8b"
							strokeWidth="1"
							fill="none"
						/>

						{/* Connection lines */}
						<line
							x1="140"
							y1="80"
							x2="140"
							y2="200"
							stroke="#d4bc8b"
							strokeWidth="1"
							strokeOpacity="0.7"
						/>
						<line
							x1="80"
							y1="140"
							x2="200"
							y2="140"
							stroke="#d4bc8b"
							strokeWidth="1"
							strokeOpacity="0.7"
						/>
						<line
							x1="95"
							y1="95"
							x2="185"
							y2="185"
							stroke="#d4bc8b"
							strokeWidth="1"
							strokeOpacity="0.7"
						/>
						<line
							x1="95"
							y1="185"
							x2="185"
							y2="95"
							stroke="#d4bc8b"
							strokeWidth="1"
							strokeOpacity="0.7"
						/>

						{/* Star of David */}
						<path
							d="M140 60L170 110L140 160L110 110L140 60Z"
							stroke="#d4bc8b"
							strokeWidth="1"
							strokeOpacity="0.8"
							fill="none"
						/>
						<path
							d="M140 100L170 150L140 200L110 150L140 100Z"
							stroke="#d4bc8b"
							strokeWidth="1"
							strokeOpacity="0.8"
							fill="none"
						/>

						{/* Glow effects */}
						<circle cx="140" cy="140" r="3" fill="#d4bc8b">
							<animate
								attributeName="opacity"
								values="0.5;1;0.5"
								dur="3s"
								repeatCount="indefinite"
							/>
						</circle>
						<circle cx="140" cy="80" r="3" fill="#d4bc8b">
							<animate
								attributeName="opacity"
								values="0.5;1;0.5"
								dur="3s"
								repeatCount="indefinite"
							/>
						</circle>
						<circle cx="140" cy="200" r="3" fill="#d4bc8b">
							<animate
								attributeName="opacity"
								values="0.5;1;0.5"
								dur="3s"
								repeatCount="indefinite"
							/>
						</circle>
						<circle cx="80" cy="140" r="3" fill="#d4bc8b">
							<animate
								attributeName="opacity"
								values="0.5;1;0.5"
								dur="3s"
								repeatCount="indefinite"
							/>
						</circle>
						<circle cx="200" cy="140" r="3" fill="#d4bc8b">
							<animate
								attributeName="opacity"
								values="0.5;1;0.5"
								dur="3s"
								repeatCount="indefinite"
							/>
						</circle>
						<circle cx="95" cy="95" r="3" fill="#d4bc8b">
							<animate
								attributeName="opacity"
								values="0.5;1;0.5"
								dur="3s"
								repeatCount="indefinite"
							/>
						</circle>
						<circle cx="185" cy="95" r="3" fill="#d4bc8b">
							<animate
								attributeName="opacity"
								values="0.5;1;0.5"
								dur="3s"
								repeatCount="indefinite"
							/>
						</circle>
						<circle cx="95" cy="185" r="3" fill="#d4bc8b">
							<animate
								attributeName="opacity"
								values="0.5;1;0.5"
								dur="3s"
								repeatCount="indefinite"
							/>
						</circle>
						<circle cx="185" cy="185" r="3" fill="#d4bc8b">
							<animate
								attributeName="opacity"
								values="0.5;1;0.5"
								dur="3s"
								repeatCount="indefinite"
							/>
						</circle>
					</svg>
				</div>
			</motion.div>
		</div>
	);
};
