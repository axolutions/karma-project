import { supabase } from "@/integrations/supabase/client";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    addKarmicMap,
    deleteKarmicMapById,
    updateKarmicMapData,
} from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type KarmicMap = {
    created_at: string;
    id: number;
    selected_map: string;
    skus: string[];
};

const AVAILABLE_MAPS = [
    { value: "professional", label: "Profissional" },
    { value: "love", label: "Amoroso" },
    { value: "personal", label: "Pessoal" },
];

export function KarmicMapSelection() {
    const [maps, setMaps] = useState<KarmicMap[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [newMapType, setNewMapType] = useState<string>(
        AVAILABLE_MAPS[0].value,
    );
    const [newMapSkus, setNewMapSkus] = useState<string>("");

    const [editingSkusMapId, setEditingSkusMapId] = useState<number | null>(
        null,
    );
    const [currentEditSkus, setCurrentEditSkus] = useState<string>("");
    const [isAddMapModalOpen, setIsAddMapModalOpen] = useState(false);

    const getMaps = useCallback(async () => {
        setLoading(true);
        setMaps([]);
        setError(null);
        try {
            const { data, error: supaError } = await supabase.from(
                "karmic_maps",
            ).select("*");
            if (supaError) {
                throw supaError;
            }
            setMaps(data?.sort((a, b) => a.id - b.id) || []);
            return data || [];
        } catch (err: any) {
            console.error("Error fetching maps:", err);
            setError(err.message || "Falha ao buscar mapas");
            setMaps([]);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getMaps();
    }, [getMaps]);

    const handleAddMap = async () => {
        if (!newMapType) {
            toast.error("O tipo de mapa é obrigatório.");
            return;
        }
        const skusArray = newMapSkus.split(",").map((s) => s.trim()).filter(
            (s) => s,
        );
        if (skusArray.length === 0) {
            toast.error("Pelo menos um SKU é obrigatório.");
            return;
        }

        try {
            setLoading(true);
            await addKarmicMap({ selected_map: newMapType, skus: skusArray });
            toast.success("Novo mapa kármico adicionado com sucesso!");
            setNewMapSkus("");
            setNewMapType(AVAILABLE_MAPS[0].value);
            await getMaps();
            setIsAddMapModalOpen(false); // Ensure modal closes
        } catch (err: any) {
            toast.error("Falha ao adicionar mapa kármico: " + err.message);
            console.error("Error adding map:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSelectedMap = async (
        mapId: number,
        newSelectedMap: string,
    ) => {
        const mapToUpdate = maps.find((m) => m.id === mapId);
        if (!mapToUpdate) return;

        try {
            setLoading(true);
            await updateKarmicMapData(mapId, {
                selected_map: newSelectedMap,
                skus: mapToUpdate.skus,
            });
            toast.success(
                `Seleção do mapa ${mapId} atualizada para ${newSelectedMap}.`,
            );
            await getMaps();
        } catch (err: any) {
            toast.error("Falha ao atualizar a seleção do mapa: " + err.message);
            console.error("Error updating map selection:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartEditSkus = (mapId: number, currentSkus: string[]) => {
        setEditingSkusMapId(mapId);
        setCurrentEditSkus(currentSkus.join(", "));
    };

    const handleCancelEditSkus = () => {
        setEditingSkusMapId(null);
        setCurrentEditSkus("");
    };

    const handleSaveSkus = async (mapId: number) => {
        const mapToUpdate = maps.find((m) => m.id === mapId);
        if (!mapToUpdate) return;

        const skusArray = currentEditSkus.split(",").map((s) => s.trim())
            .filter((s) => s);
        if (skusArray.length === 0) {
            toast.error("Pelo menos um SKU é obrigatório para salvar.");
            return;
        }

        try {
            setLoading(true);
            await updateKarmicMapData(mapId, {
                selected_map: mapToUpdate.selected_map,
                skus: skusArray,
            });
            toast.success(`SKUs para o mapa ${mapId} atualizados com sucesso.`);
            handleCancelEditSkus();
            await getMaps();
        } catch (err: any) {
            toast.error("Falha ao atualizar SKUs: " + err.message);
            console.error("Error updating SKUs:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMap = async (mapId: number) => {
        if (
            window.confirm(
                `Tem certeza que deseja deletar o mapa ID ${mapId}? Esta ação não pode ser desfeita.`,
            )
        ) {
            try {
                setLoading(true);
                await deleteKarmicMapById(mapId);
                toast.success(`Mapa kármico ${mapId} deletado com sucesso.`);
                await getMaps();
            } catch (err: any) {
                toast.error("Falha ao deletar mapa kármico: " + err.message);
                console.error("Error deleting map:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading && maps.length === 0) {
        return (
            <div className="max-w-2xl mx-auto p-6 bg-karmic-100 rounded-lg shadow-md text-center">
                <p className="text-karmic-700">Carregando mapas...</p>
                <div className="w-8 h-8 border-t-2 border-karmic-500 border-solid rounded-full animate-spin mx-auto mt-4">
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md text-center">
                <p className="font-semibold">Erro ao carregar mapas:</p>
                <p>{error}</p>
                <Button
                    onClick={getMaps}
                    className="mt-4 karmic-button"
                    disabled={loading}
                >
                    {loading ? "Tentando novamente..." : "Tentar Novamente"}
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex space-x-2">
                <Dialog
                    open={isAddMapModalOpen}
                    onOpenChange={setIsAddMapModalOpen}
                >
                    <DialogTrigger asChild>
                        <Button className="karmic-button">
                            Adicionar Novo Mapa
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl md:text-2xl font-serif text-karmic-800">
                                Adicionar Novo Mapa
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label
                                    htmlFor="newMapTypeModal"
                                    className="text-karmic-700"
                                >
                                    Tipo de Mapa
                                </Label>
                                <Select
                                    value={newMapType}
                                    onValueChange={setNewMapType}
                                >
                                    <SelectTrigger
                                        id="newMapTypeModal"
                                        className="w-full karmic-button-outline mt-1"
                                    >
                                        <SelectValue placeholder="Selecione um tipo de mapa" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {AVAILABLE_MAPS.map((availableMap) => (
                                            <SelectItem
                                                key={availableMap.value}
                                                value={availableMap.value}
                                            >
                                                {availableMap.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label
                                    htmlFor="newMapSkusModal"
                                    className="text-karmic-700"
                                >
                                    SKUs (separados por vírgula)
                                </Label>
                                <Input
                                    id="newMapSkusModal"
                                    type="text"
                                    value={newMapSkus}
                                    onChange={(e) =>
                                        setNewMapSkus(e.target.value)}
                                    placeholder="ex: SKU123, SKU456"
                                    className="mt-1"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                            </DialogClose>
                            <Button
                                onClick={handleAddMap}
                                className="karmic-button"
                                disabled={loading}
                            >
                                {loading ? "Adicionando..." : "Adicionar Mapa"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Button
                    onClick={getMaps}
                    className="karmic-button-outline"
                    disabled={loading}
                >
                    {loading ? "Recarregando..." : "Recarregar Mapas"}
                </Button>
            </div>

            <h1 className="text-2xl md:text-3xl font-serif font-medium text-karmic-800 mb-6 text-center">
                Mapas Kármicos
            </h1>

            {loading && maps.length > 0 && (
                <div className="text-center text-karmic-700">
                    <div className="w-6 h-6 border-t-2 border-karmic-500 border-solid rounded-full animate-spin mx-auto my-4">
                    </div>
                    Atualizando mapas...
                </div>
            )}

            {maps.length === 0 && !loading && (
                <div className="max-w-2xl mx-auto p-6 bg-karmic-100 rounded-lg shadow-md text-center">
                    <p className="text-karmic-700">
                        Nenhum mapa encontrado.
                    </p>
                </div>
            )}

            <div className="space-y-6">
                {maps.map((map) => (
                    <Card key={map.id} className="karmic-card p-5">
                        <CardHeader className="p-0 pb-4">
                            <CardTitle className="karmic-title text-xl flex justify-between items-center">
                                <span>Mapa ID: {map.id}</span>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                        handleDeleteMap(map.id)}
                                    disabled={loading}
                                >
                                    Deletar Mapa
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-4">
                            <div>
                                <Label className="text-karmic-700 block mb-1">
                                    Tipo de Mapa Selecionado
                                </Label>
                                <Select
                                    value={map.selected_map ||
                                        AVAILABLE_MAPS[0].value}
                                    onValueChange={(value) =>
                                        handleUpdateSelectedMap(map.id, value)}
                                    disabled={loading}
                                >
                                    <SelectTrigger className="w-full md:w-[280px] karmic-button-outline">
                                        <SelectValue placeholder="Selecione um tipo de mapa" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {AVAILABLE_MAPS.map((availableMap) => (
                                            <SelectItem
                                                key={availableMap.value}
                                                value={availableMap.value}
                                            >
                                                {availableMap.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-karmic-700 block mb-1">
                                    SKUs Associados
                                </Label>
                                {editingSkusMapId === map.id
                                    ? (
                                        <div className="space-y-2">
                                            <Input
                                                type="text"
                                                value={currentEditSkus}
                                                onChange={(e) =>
                                                    setCurrentEditSkus(
                                                        e.target.value,
                                                    )}
                                                placeholder="ex: SKU123, SKU456"
                                                disabled={loading}
                                            />
                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        handleSaveSkus(map.id)}
                                                    className="karmic-button"
                                                    disabled={loading}
                                                >
                                                    {loading
                                                        ? "Salvando..."
                                                        : "Salvar SKUs"}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={handleCancelEditSkus}
                                                    disabled={loading}
                                                >
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                    : (
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium text-karmic-600 bg-karmic-100 px-3 py-2 rounded-md text-sm">
                                                {map.skus.join(", ")}
                                            </p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleStartEditSkus(
                                                        map.id,
                                                        map.skus,
                                                    )}
                                                disabled={loading}
                                            >
                                                Editar SKUs
                                            </Button>
                                        </div>
                                    )}
                            </div>
                            <p className="text-xs text-karmic-500 mt-2">
                                Criado em:{" "}
                                {new Date(map.created_at).toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
