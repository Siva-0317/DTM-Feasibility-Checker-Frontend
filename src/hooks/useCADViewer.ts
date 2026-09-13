import { useCallback, useState } from "react";
import { DTMRuleResult } from "../lib/types";

export interface DefectCoordinate {
  position: [number, number, number];
  ruleId: string;
  ruleName: string;
}

export function useCADViewer() {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [defectCoordinates, setDefectCoordinates] = useState<DefectCoordinate[]>([]);
  const [selectedDefect, setSelectedDefect] = useState<number | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);

  const setModel = useCallback((url: string) => {
    setModelUrl(url);
    setIsModelLoaded(false); // Reset loaded state for new model
    setDefectCoordinates([]);
    setSelectedDefect(null);
  }, []);

  const setDefects = useCallback((rules: DTMRuleResult[]) => {
    const coords: DefectCoordinate[] = [];
    
    rules.forEach((rule) => {
      if (rule.status === "FAIL" && rule.defect_coordinates) {
        rule.defect_coordinates.forEach((position) => {
          coords.push({
            position,
            ruleId: rule.rule_id,
            ruleName: rule.rule_name,
          });
        });
      }
    });
    
    setDefectCoordinates(coords);
  }, []);

  const selectDefect = useCallback(
    (index: number) => {
      if (index >= 0 && index < defectCoordinates.length) {
        setSelectedDefect(index);
      } else {
        setSelectedDefect(null);
      }
    },
    [defectCoordinates]
  );

  const clearViewer = useCallback(() => {
    setModelUrl(null);
    setDefectCoordinates([]);
    setSelectedDefect(null);
    setIsModelLoaded(false);
  }, []);

  return {
    modelUrl,
    defectCoordinates,
    selectedDefect,
    isModelLoaded,
    setIsModelLoaded,
    setModel,
    setDefects,
    selectDefect,
    clearViewer,
  };
}
