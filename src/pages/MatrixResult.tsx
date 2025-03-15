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

const MatrixResult: React.FC = () => {
	const [userData, setUserData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [interpretationsLoaded, setInterpretationsLoaded] = useState(false);
	const { toast } = useToast();
	const [pdfMode, setPdfMode] = useState(false);
	const navigate = useNavigate();

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
					navigate("/matrix-profissional");
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
			<UserHeader
				userData={userData}
				handleDownloadPDF={handleDownloadPDF}
			/>
			<KarmicMatrix karmicData={karmicData} />
			<KarmicIntroduction />
			<MatrixInterpretations karmicData={karmicData} pdfMode={pdfMode} />
			<KarmicEnding/>
		</div>
	);
};

export default MatrixResult;
