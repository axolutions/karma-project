import React, { useState, useEffect } from "react";
import { getUserData, isLoggedIn, getCurrentUser } from "../lib/auth";
import { getAllUserDataByEmail } from "../lib/auth";
import UserHeader from "../components/matrix/UserHeader";
import KarmicMatrix from "../components/KarmicMatrix";
import MatrixInterpretations from "../components/MatrixInterpretations";
import { useToast } from "@/components/ui/use-toast";
import LoadingState from "../components/matrix/LoadingState";
import ErrorState from "../components/matrix/ErrorState";
import { useNavigate } from "react-router-dom";
import KarmicIntroduction from "@/components/KarmicIntroduction";
import KarmicEnding from "@/components/KarmicEnding";
import { dispatch } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MatrixResult: React.FC = () => {
	const [userData, setUserData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [interpretationsLoaded, setInterpretationsLoaded] = useState(false);
	const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["personalIntro", "personalEnding"]));
	const { toast } = useToast();
	const [pdfMode, setPdfMode] = useState(false);
	const navigate = useNavigate();

	const toggleSection = (section: string) => {
		setExpandedSections((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(section)) {
				newSet.delete(section);
			} else {
				newSet.add(section);
			}
			return newSet;
		});
	};

	// Load interpretations immediately when component mounts
	useEffect(() => {
		console.log("MatrixResult: Carregando interpretações...");
		try {
			setInterpretationsLoaded(true);
			console.log("MatrixResult: Interpretações carregadas com sucesso");
		} catch (err) {
			console.error("Erro ao carregar interpretações:", err);
			toast({
				title: "Aviso",
				description: "Carregando interpretações de fallback.",
				variant: "default",
			});

			// Try to use sample interpretations as fallback even if there's an error
			try {
				setInterpretationsLoaded(true);
			} catch (e) {
				console.error(
					"Não foi possível carregar interpretações de amostra:",
					e,
				);
			}
		}
	}, []);

	useEffect(() => {
		if (pdfMode) {
			dispatch({ type: "REMOVE_TOAST" });
			setTimeout(() => {
				window.print();
				setPdfMode(false);
			}, 1000);
		}
	}, [pdfMode])

	useEffect(() => {
		const loadUserData = async () => {
			try {
				// Verificar se o usuário está logado
				if (!isLoggedIn()) {
					console.error("Usuário não está logado");
					setError("Sessão expirada. Por favor, faça login novamente.");
					setLoading(false);
					return;
				}

				// Obter o email do usuário atual
				const email = getCurrentUser();
				if (!email) {
					console.error("Email do usuário não encontrado no localStorage");
					setError("Dados de usuário não encontrados.");
					setLoading(false);
					return;
				}

				console.log("MatrixResult: Carregando dados para o email:", email);

				// Obter os dados do usuário pelo email
				const data = await getUserData(email);
				console.log("MatrixResult: Dados obtidos:", data);

				if (!data) {
					console.error(
						"Dados do usuário não encontrados para o email:",
						email,
					);
					setError(
						"Dados de usuário não encontrados. Por favor, faça login novamente.",
					);
					setLoading(false);
					return;
				}

				// Se o usuário não tem nome ou dados kármicos, redirecionar para completar o perfil
				if (!data.name) {
					console.log(
						"MatrixResult: Usuário sem nome, redirecionando para completar perfil",
					);
					setError(
						"Perfil incompleto. Por favor, complete seu perfil primeiro.",
					);
					navigate("/");
					return;
				}

				// Verificar se o usuário tem dados kármicos
				if (!data.karmic_numbers.length) {
					console.error(
						"Dados kármicos não encontrados para o usuário:",
						email,
					);
					setError(
						"Dados kármicos não encontrados. Por favor, complete seu perfil novamente.",
					);
					navigate("/");
					return;
				}

				if (data.map_choosen === "professional") {
					navigate("/matrix-professional");
					return;
				} else if (data.map_choosen === "love") {
					navigate("/matrix-love");
					return;
				}

				console.log(
					"MatrixResult: Dados kármicos encontrados:",
					data.karmic_numbers,
				);
				setUserData({  ...data, karmicNumbers: data.karmic_numbers[0] });
				setLoading(false);
			} catch (err) {
				console.error("Erro ao carregar dados do usuário:", err);
				setError("Erro ao carregar dados. Por favor, recarregue a página.");
				setLoading(false);
			}
		};

		// Garantir que as interpretações sejam carregadas primeiro
		if (interpretationsLoaded) {
			loadUserData();
		}
	}, [navigate, interpretationsLoaded]);

	function handleDownloadPDF() {
		if (!userData?.karmicNumbers) {
			toast({
				title: "Erro ao gerar PDF",
				description: "Dados kármicos não disponíveis para download.",
				variant: "destructive",
			});
			return;
		}

		setPdfMode(true);
	}

	if (loading) return <LoadingState />;
	if (error) return <ErrorState />;

	// Garantir que temos dados kármicos válidos
	const karmicData = userData?.karmicNumbers || {
		karmicSeal: 0,
		destinyCall: 0,
		karmaPortal: 0,
		karmicInheritance: 0,
		karmicReprogramming: 0,
		cycleProphecy: 0,
		spiritualMark: 0,
		manifestationEnigma: 0,
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-6xl">
			<div className="mb-4">
				<Button 
					variant="outline" 
					onClick={() => navigate("/escolher-mapa")}
					className="flex items-center text-base"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Voltar para Seleção
				</Button>
			</div>
			<UserHeader
				userData={userData}
				handleDownloadPDF={handleDownloadPDF}
			/>
			<KarmicMatrix karmicData={karmicData} />

			{/* Introdução com toggle */}
			<div className="max-w-4xl mx-auto my-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className="bg-[#f5f5dc] rounded-lg shadow-sm overflow-hidden"
				>
					<div 
						className="flex justify-between items-center p-4 border-b border-[#e2d1c3] cursor-pointer"
						onClick={() => toggleSection("personalIntro")}
					>
						<h3 className="text-xl text-[#333333] font-semibold">
							Bem-vindo à sua Matriz Kármica Pessoal
						</h3>
						{expandedSections.has("personalIntro") ? (
							<ChevronUp className="h-5 w-5 text-[#8B4513]" />
						) : (
							<ChevronDown className="h-5 w-5 text-[#8B4513]" />
						)}
					</div>

					<AnimatePresence>
						{expandedSections.has("personalIntro") && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.3 }}
								className="overflow-hidden"
							>
								<div className="p-6">
									<KarmicIntroduction userName={userData?.name} />
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			</div>

			<MatrixInterpretations karmicData={karmicData} pdfMode={pdfMode} />

			{/* Conclusão com toggle */}
			<div className="max-w-4xl mx-auto my-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className="bg-[#f5f5dc] rounded-lg shadow-sm overflow-hidden"
				>
					<div 
						className="flex justify-between items-center p-4 border-b border-[#e2d1c3] cursor-pointer"
						onClick={() => toggleSection("personalEnding")}
					>
						<h3 className="text-xl text-[#333333] font-semibold">
							Próximos Passos na Sua Jornada Kármica
						</h3>
						{expandedSections.has("personalEnding") ? (
							<ChevronUp className="h-5 w-5 text-[#8B4513]" />
						) : (
							<ChevronDown className="h-5 w-5 text-[#8B4513]" />
						)}
					</div>

					<AnimatePresence>
						{expandedSections.has("personalEnding") && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.3 }}
								className="overflow-hidden"
							>
								<div className="p-6">
									<KarmicEnding userName={userData?.name} />
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			</div>
		</div>
	);
};

export default MatrixResult;
