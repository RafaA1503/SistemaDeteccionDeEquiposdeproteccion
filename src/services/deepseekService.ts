
const DEEPSEEK_API_KEY = 'sk-2bb0ae9631e0487a832c16e6a95712b9';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export interface PPEDetectionResult {
  hasHelmet: boolean;
  hasGloves: boolean;
  hasSafetyGlasses: boolean;
  hasMask: boolean;
  hasVest: boolean;
  confidence: number;
  details: string;
  overallCompliance: boolean;
  timestamp: string;
  imageUrl?: string;
  missingItems: string[];
  analysisSteps: string[];
  preTrainingScore: number;
}

// Función para comprimir imagen y reducir tokens
function compressImageBase64(base64: string, maxWidth: number = 640, quality: number = 0.7): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Calcular nuevas dimensiones manteniendo proporción
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Dibujar imagen redimensionada
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convertir a base64 comprimido
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality).split(',')[1];
      resolve(compressedBase64);
    };
    
    img.src = `data:image/jpeg;base64,${base64}`;
  });
}

// Clase para almacenar y gestionar el pre-entrenamiento
class PreTrainingManager {
  private static trainingData: Array<{
    imageFeatures: string;
    result: PPEDetectionResult;
    feedback: 'correct' | 'incorrect';
  }> = [];

  static addTrainingExample(imageFeatures: string, result: PPEDetectionResult, feedback: 'correct' | 'incorrect') {
    this.trainingData.push({ imageFeatures, result, feedback });
    
    // Limitar a últimos 50 ejemplos para optimizar memoria
    if (this.trainingData.length > 50) {
      this.trainingData = this.trainingData.slice(-50);
    }
    
    console.log(`Pre-entrenamiento actualizado. Ejemplos: ${this.trainingData.length}`);
  }

  static getTrainingContext(): string {
    if (this.trainingData.length === 0) return '';

    const correctExamples = this.trainingData.filter(t => t.feedback === 'correct').slice(-5);
    const incorrectExamples = this.trainingData.filter(t => t.feedback === 'incorrect').slice(-3);

    let context = '\n\nCONTEXTO DE ENTRENAMIENTO PREVIO:\n';
    
    if (correctExamples.length > 0) {
      context += '\nEJEMPLOS CORRECTOS PREVIOS:\n';
      correctExamples.forEach((example, i) => {
        context += `Ejemplo ${i + 1}: ${example.result.details}\n`;
      });
    }

    if (incorrectExamples.length > 0) {
      context += '\nERRORES A EVITAR:\n';
      incorrectExamples.forEach((example, i) => {
        context += `Error ${i + 1}: ${example.result.details}\n`;
      });
    }

    return context;
  }

  static getPreTrainingScore(): number {
    if (this.trainingData.length === 0) return 0;
    
    const correctCount = this.trainingData.filter(t => t.feedback === 'correct').length;
    return Math.round((correctCount / this.trainingData.length) * 100);
  }
}

export class DeepSeekService {
  // Análisis preliminar de la imagen
  static async performPreAnalysis(imageBase64: string): Promise<string> {
    try {
      console.log('🔍 Iniciando pre-análisis de imagen...');
      
      const compressedBase64 = await compressImageBase64(imageBase64, 480, 0.5);
      
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: `Analiza esta imagen y describe DETALLADAMENTE todo lo que ves relacionado con equipos de protección personal. 
              
              IMAGEN: data:image/jpeg;base64,${compressedBase64}
              
              Describe:
              1. Personas visibles
              2. Equipos de protección que puedes identificar
              3. Colores y características específicas
              4. Contexto del entorno
              5. Calidad de la imagen
              
              Sé muy específico y detallado.`
            }
          ],
          max_tokens: 500,
          temperature: 0.2
        })
      });

      if (!response.ok) {
        throw new Error(`Error en pre-análisis: ${response.status}`);
      }

      const data = await response.json();
      const analysis = data.choices[0].message.content;
      
      console.log('✅ Pre-análisis completado:', analysis.substring(0, 100) + '...');
      return analysis;
      
    } catch (error) {
      console.error('❌ Error en pre-análisis:', error);
      return 'Pre-análisis no disponible';
    }
  }

  // Análisis principal mejorado con pre-entrenamiento
  static async analyzeImageForPPE(imageBase64: string): Promise<PPEDetectionResult> {
    try {
      console.log('🤖 Iniciando análisis inteligente de EPP...');
      
      const analysisSteps: string[] = [];
      
      // Paso 1: Pre-análisis
      analysisSteps.push('Realizando pre-análisis de imagen...');
      const preAnalysis = await this.performPreAnalysis(imageBase64);
      
      // Paso 2: Obtener contexto de entrenamiento
      analysisSteps.push('Aplicando conocimiento de entrenamiento previo...');
      const trainingContext = PreTrainingManager.getTrainingContext();
      
      // Paso 3: Análisis principal
      analysisSteps.push('Ejecutando análisis principal de EPP...');
      const compressedBase64 = await compressImageBase64(imageBase64, 640, 0.6);
      
      const enhancedPrompt = `Eres un experto en seguridad industrial especializado en detección de EPP. 

PRE-ANÁLISIS REALIZADO:
${preAnalysis}

${trainingContext}

INSTRUCCIONES ESPECÍFICAS:
1. Analiza meticulosamente cada área de la imagen
2. Identifica personas y examina cada una individualmente
3. Busca específicamente: cascos, guantes, gafas/lentes de seguridad, mascarillas/respiradores, chalecos reflectantes
4. Considera variaciones de color y diseño
5. Ten en cuenta el contexto del entorno de trabajo

IMAGEN A ANALIZAR: data:image/jpeg;base64,${compressedBase64}

Responde ÚNICAMENTE en formato JSON válido:
{
  "hasHelmet": boolean,
  "hasGloves": boolean,
  "hasSafetyGlasses": boolean,
  "hasMask": boolean,
  "hasVest": boolean,
  "confidence": number (0-100),
  "details": "descripción detallada del análisis paso a paso",
  "overallCompliance": boolean
}`;

      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'Eres un experto en seguridad industrial. Analiza imágenes con máxima precisión para detectar equipos de protección personal. Responde únicamente en JSON válido.'
            },
            {
              role: 'user',
              content: enhancedPrompt
            }
          ],
          max_tokens: 600,
          temperature: 0.1,
          top_p: 0.8
        })
      });

      console.log('📊 Status de respuesta:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Error en la API de DeepSeek: ${response.status}`);
      }

      const data = await response.json();
      console.log('📥 Respuesta recibida de DeepSeek');

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Respuesta inválida de la API');
      }

      const content = data.choices[0].message.content;
      
      // Extraer y parsear JSON
      let jsonContent = content.trim();
      const jsonStart = jsonContent.indexOf('{');
      const jsonEnd = jsonContent.lastIndexOf('}') + 1;
      
      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        jsonContent = jsonContent.substring(jsonStart, jsonEnd);
      }
      
      analysisSteps.push('Procesando resultado del análisis...');
      
      try {
        const result = JSON.parse(jsonContent);
        
        // Crear lista de elementos faltantes
        const missingItems: string[] = [];
        if (!result.hasHelmet) missingItems.push('Casco de seguridad');
        if (!result.hasGloves) missingItems.push('Guantes de protección');
        if (!result.hasSafetyGlasses) missingItems.push('Gafas de seguridad');
        if (!result.hasMask) missingItems.push('Mascarilla');
        if (!result.hasVest) missingItems.push('Chaleco de seguridad');
        
        analysisSteps.push('Validando resultado y completando análisis...');
        
        // Validar y construir resultado final
        const validatedResult: PPEDetectionResult = {
          hasHelmet: Boolean(result.hasHelmet),
          hasGloves: Boolean(result.hasGloves),
          hasSafetyGlasses: Boolean(result.hasSafetyGlasses),
          hasMask: Boolean(result.hasMask),
          hasVest: Boolean(result.hasVest),
          confidence: Math.min(100, Math.max(0, Number(result.confidence) || 75)),
          details: String(result.details || 'Análisis completado con IA avanzada'),
          overallCompliance: Boolean(result.overallCompliance),
          timestamp: new Date().toISOString(),
          missingItems,
          analysisSteps,
          preTrainingScore: PreTrainingManager.getPreTrainingScore()
        };
        
        // Auto-entrenamiento: asumir que el resultado es correcto inicialmente
        // En una implementación real, esto se basaría en feedback del usuario
        PreTrainingManager.addTrainingExample(
          preAnalysis.substring(0, 200), 
          validatedResult, 
          'correct'
        );
        
        console.log('✅ Análisis completado exitosamente');
        console.log('📈 Score de pre-entrenamiento:', validatedResult.preTrainingScore + '%');
        
        return validatedResult;
        
      } catch (parseError) {
        console.error('❌ Error parseando JSON:', parseError);
        
        // Fallback con análisis básico
        const fallbackResult: PPEDetectionResult = {
          hasHelmet: content.toLowerCase().includes('casco') || content.toLowerCase().includes('helmet'),
          hasGloves: content.toLowerCase().includes('guantes') || content.toLowerCase().includes('gloves'),
          hasSafetyGlasses: content.toLowerCase().includes('gafas') || content.toLowerCase().includes('glasses'),
          hasMask: content.toLowerCase().includes('mascarilla') || content.toLowerCase().includes('mask'),
          hasVest: content.toLowerCase().includes('chaleco') || content.toLowerCase().includes('vest'),
          confidence: 50,
          details: `Análisis de texto (modo recuperación): ${content.substring(0, 200)}...`,
          overallCompliance: false,
          timestamp: new Date().toISOString(),
          missingItems: ['Análisis requiere revisión manual'],
          analysisSteps: [...analysisSteps, 'Usando modo de recuperación por error de parsing'],
          preTrainingScore: PreTrainingManager.getPreTrainingScore()
        };
        
        return fallbackResult;
      }
      
    } catch (error) {
      console.error('❌ Error completo en análisis:', error);
      
      throw new Error(`Error en análisis inteligente de EPP: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  // Método para proporcionar feedback y mejorar el entrenamiento
  static provideFeedback(result: PPEDetectionResult, isCorrect: boolean) {
    const feedback: 'correct' | 'incorrect' = isCorrect ? 'correct' : 'incorrect';
    PreTrainingManager.addTrainingExample(
      result.details.substring(0, 200),
      result,
      feedback
    );
    
    console.log(`📝 Feedback registrado: ${feedback}. Score actual: ${PreTrainingManager.getPreTrainingScore()}%`);
  }
}
