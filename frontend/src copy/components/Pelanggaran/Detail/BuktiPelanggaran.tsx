"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Download, Eye, FileText } from "lucide-react";

type Evidence = {
  id: number;
  type: string;
  url: string;
  name?: string;
  description?: string;
  uploadedBy: string;
  uploadedAt: string;
};

export default function BuktiPelanggaran({ bukti, onLihat }: { bukti: Evidence[]; onLihat: (e: Evidence) => void }) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-blue-600 flex items-center gap-2">
          <Camera className="w-5 h-5" /> Bukti Pelanggaran
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bukti.length > 0 ? (
          <div className="space-y-4">
            {bukti.map((e) =>
              e.type === "image" ? (
                <div key={e.id} className="flex flex-col sm:flex-row gap-4 border rounded-lg p-4 hover:bg-gray-50">
                  <img
                    src={e.url}
                    alt={e.description}
                    className="w-full sm:w-32 h-24 object-cover rounded cursor-pointer hover:opacity-80"
                    onClick={() => onLihat(e)}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{e.description}</h4>
                    <p className="text-sm text-gray-600 mb-2">Diunggah oleh: {e.uploadedBy}</p>
                    <p className="text-xs text-gray-500">{e.uploadedAt}</p>
                  </div>
                  <div className="flex sm:flex-col gap-2">
                    <Button size="sm" variant="outline" onClick={() => onLihat(e)}>
                      <Eye className="w-4 h-4" /> <span className="hidden sm:inline">Lihat</span>
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" /> <span className="hidden sm:inline">Unduh</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div key={e.id} className="flex items-center gap-4 border rounded-lg p-4 hover:bg-gray-50">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{e.name}</h4>
                    <p className="text-sm text-gray-600 mb-1">{e.description}</p>
                    <p className="text-xs text-gray-500">Diunggah oleh: {e.uploadedBy} | {e.uploadedAt}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" /> <span className="hidden sm:inline">Unduh</span>
                  </Button>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Belum ada bukti yang diunggah</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
