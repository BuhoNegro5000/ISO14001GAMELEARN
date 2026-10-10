export interface ClassifyItem {
  id: string;
  text: string;
  answer: string;
  why: string;
}

export interface SelectItem {
  id: string;
  text: string;
  correct: boolean;
  why: string;
}

interface BaseExercise {
  id: string;
  clause: 4 | 5 | 6 | 7 | 8 | 9 | 10;
  ref: string;
  title: string;
  intro: string;
  xp: number;
  successMessage: string;
}

export interface ClassifyExercise extends BaseExercise {
  kind: 'classify';
  categories: { id: string; label: string }[];
  items: ClassifyItem[];
}

export interface SelectExercise extends BaseExercise {
  kind: 'select';
  items: SelectItem[];
}

export type Exercise = ClassifyExercise | SelectExercise;

export const clauseExercises: Exercise[] = [
  {
    id: '42',
    clause: 4,
    ref: '§4.2',
    kind: 'classify',
    title: 'Partes interesadas: de la expectativa a la obligación de cumplimiento',
    intro:
      'La organización determina las partes interesadas pertinentes y sus necesidades y expectativas. Cuáles de ellas debe o decide cumplir se convierten en obligaciones de cumplimiento (§6.1.3). Clasifica cada situación.',
    xp: 120,
    successMessage: 'Cláusula 4.2: obligaciones de cumplimiento clasificadas.',
    categories: [
      { id: 'legal', label: 'Requisito legal' },
      { id: 'voluntary', label: 'Requisito voluntario adoptado' },
      { id: 'expectation', label: 'Expectativa aún no adoptada' }
    ],
    items: [
      {
        id: 'a',
        text: 'La licencia ambiental fija un límite máximo permisible (LMP) para los vertimientos.',
        answer: 'legal',
        why: 'Lo impone la autoridad: es un requisito legal obligatorio.'
      },
      {
        id: 'b',
        text: 'Un cliente incluye en el contrato la entrega anual de la huella de carbono Alcance 1 y 2.',
        answer: 'voluntary',
        why: 'La organización lo aceptó al firmar el contrato: es otro requisito que suscribe y debe cumplir.'
      },
      {
        id: 'c',
        text: 'La empresa se adhiere a un código sectorial de buenas prácticas ambientales.',
        answer: 'voluntary',
        why: 'La adhesión es una decisión propia; una vez adoptada pasa a ser obligación de cumplimiento.'
      },
      {
        id: 'd',
        text: 'Los vecinos desearían que la planta no opere de noche, pero no existe norma ni acuerdo.',
        answer: 'expectation',
        why: 'Es una expectativa pertinente que se debe considerar, pero no es obligación mientras la organización no decida adoptarla.'
      },
      {
        id: 'e',
        text: 'La ley de residuos peligrosos exige manifiesto en cada transporte.',
        answer: 'legal',
        why: 'Es un requisito legal aplicable a sus aspectos ambientales.'
      },
      {
        id: 'f',
        text: 'Se firma un convenio con la comunidad para monitorear el agua de forma participativa.',
        answer: 'voluntary',
        why: 'Es un acuerdo firmado con una parte interesada: queda como requisito voluntario adoptado.'
      }
    ]
  },
  {
    id: '51',
    clause: 5,
    ref: '§5.1',
    kind: 'select',
    title: 'Liderazgo: qué debe demostrar la Alta Dirección',
    intro:
      'Marca únicamente las acciones que demuestran liderazgo y compromiso según la cláusula 5.1.',
    xp: 120,
    successMessage: 'Cláusula 5.1: liderazgo y compromiso de la Alta Dirección validado.',
    items: [
      {
        id: 'a',
        text: 'El gerente general rinde cuentas por la eficacia del SGA.',
        correct: true,
        why: 'La rendición de cuentas no se delega: es el primer requisito de 5.1.'
      },
      {
        id: 'b',
        text: 'Asegura que la política y los objetivos ambientales sean compatibles con la dirección estratégica.',
        correct: true,
        why: 'El SGA debe alinearse con el contexto y la estrategia (§4.1).'
      },
      {
        id: 'c',
        text: 'Integra los requisitos del SGA en los procesos de negocio.',
        correct: true,
        why: 'Si el SGA corre en paralelo a la operación, no se integra.'
      },
      {
        id: 'd',
        text: 'Asegura que los recursos necesarios para el SGA estén disponibles.',
        correct: true,
        why: 'Sin presupuesto, personal y tecnología no hay compromiso real.'
      },
      {
        id: 'e',
        text: 'Dirige y apoya a las personas y promueve la mejora continua.',
        correct: true,
        why: 'Incluye comunicar la importancia de una gestión ambiental eficaz.'
      },
      {
        id: 'f',
        text: 'Delega toda la responsabilidad en el coordinador ambiental y solo revisa las multas.',
        correct: false,
        why: 'Puede delegar tareas, pero conserva la rendición de cuentas.'
      },
      {
        id: 'g',
        text: 'Aprueba la política sin leerla ni comunicarla al personal.',
        correct: false,
        why: 'Debe comunicar la importancia del SGA; el auditor entrevistará al personal.'
      },
      {
        id: 'h',
        text: 'Recorta el presupuesto ambiental cuando hay metas comerciales urgentes.',
        correct: false,
        why: 'Contradice el aseguramiento de recursos y la compatibilidad con la estrategia.'
      }
    ]
  },
  {
    id: '62',
    clause: 6,
    ref: '§6.2',
    kind: 'select',
    title: 'Objetivos ambientales: ¿cuáles son válidos?',
    intro:
      'Los objetivos deben ser coherentes con la política, medibles cuando sea factible, monitoreados, comunicados y actualizados, y considerar los aspectos significativos y las obligaciones de cumplimiento. Marca los objetivos que cumplen.',
    xp: 120,
    successMessage: 'Cláusula 6.2: objetivos ambientales medibles formulados.',
    items: [
      {
        id: 'a',
        text: 'Reducir 10% el consumo eléctrico por tonelada producida frente a la línea base 2025, al cierre del año, con el Jefe de Planta como responsable.',
        correct: true,
        why: 'Tiene indicador, línea base, plazo y responsable.'
      },
      {
        id: 'b',
        text: 'Cumplir el 100% de los LMP de efluentes en todos los monitoreos trimestrales del año.',
        correct: true,
        why: 'Responde a una obligación de cumplimiento y es verificable.'
      },
      {
        id: 'c',
        text: 'Reducir 20% los residuos peligrosos enviados a disposición final al 2027 mediante segregación y reúso.',
        correct: true,
        why: 'Medible, con plazo y vinculado a un aspecto significativo.'
      },
      {
        id: 'd',
        text: 'Mejorar el medio ambiente lo más posible.',
        correct: false,
        why: 'No se puede medir ni monitorear.'
      },
      {
        id: 'e',
        text: 'Maximizar las utilidades trimestrales de la planta.',
        correct: false,
        why: 'Es un objetivo comercial, no ambiental ni coherente con la política.'
      },
      {
        id: 'f',
        text: 'Ser reconocidos como la empresa más verde del país.',
        correct: false,
        why: 'Es una aspiración sin indicador ni plazo.'
      }
    ]
  },
  {
    id: '74',
    clause: 7,
    ref: '§7.4',
    kind: 'classify',
    title: 'Comunicación: qué, cuándo, con quién y cómo',
    intro:
      'La organización decide qué, cuándo, con quién y cómo comunicar, interna y externamente, y debe tomar en cuenta sus obligaciones de cumplimiento. Clasifica cada comunicación.',
    xp: 120,
    successMessage: 'Cláusula 7.4: proceso de comunicación interna y externa definido.',
    categories: [
      { id: 'internal', label: 'Interna (7.4.2)' },
      { id: 'external_req', label: 'Externa obligatoria' },
      { id: 'external_opt', label: 'Externa por decisión propia' }
    ],
    items: [
      {
        id: 'a',
        text: 'Informar a todos los turnos el cambio del procedimiento de derrames.',
        answer: 'internal',
        why: 'Se comunica entre niveles y funciones de la organización.'
      },
      {
        id: 'b',
        text: 'Entregar a la autoridad el reporte anual de emisiones exigido por ley.',
        answer: 'external_req',
        why: 'La obligación de cumplimiento determina que se debe comunicar.'
      },
      {
        id: 'c',
        text: 'Responder por escrito el reclamo de un vecino por ruido.',
        answer: 'external_opt',
        why: 'La organización debe responder a las comunicaciones pertinentes de partes interesadas según su proceso de comunicación.'
      },
      {
        id: 'd',
        text: 'Publicar el informe de sostenibilidad en el sitio web.',
        answer: 'external_opt',
        why: 'Ninguna norma lo exige; es decisión de la organización.'
      },
      {
        id: 'e',
        text: 'Notificar a la autoridad un derrame significativo dentro del plazo legal.',
        answer: 'external_req',
        why: 'Es un plazo legal: comunicar es obligatorio.'
      },
      {
        id: 'f',
        text: 'Reunión mensual del comité ambiental con los jefes de área.',
        answer: 'internal',
        why: 'Es un canal interno para tratar el desempeño del SGA.'
      }
    ]
  },
  {
    id: '81',
    clause: 8,
    ref: '§8.1',
    kind: 'select',
    title: 'Control operacional más allá del perímetro de la planta',
    intro:
      'La cláusula 8.1 exige considerar la perspectiva de ciclo de vida y controlar o influir en los procesos tercerizados. Marca lo que la norma efectivamente requiere.',
    xp: 120,
    successMessage: 'Cláusula 8.1: control de ciclo de vida y procesos tercerizados validado.',
    items: [
      {
        id: 'a',
        text: 'Asegurar que los procesos tercerizados (p. ej., transporte y disposición de residuos peligrosos) estén controlados o influenciados.',
        correct: true,
        why: 'Tercerizar la actividad no elimina el aspecto ambiental.'
      },
      {
        id: 'b',
        text: 'Comunicar los requisitos ambientales a proveedores y contratistas.',
        correct: true,
        why: 'Es parte de controlar o influir en la cadena de suministro.'
      },
      {
        id: 'c',
        text: 'Considerar el ciclo de vida del producto al establecer los controles.',
        correct: true,
        why: 'Desde la extracción de insumos hasta la disposición final.'
      },
      {
        id: 'd',
        text: 'Informar sobre los impactos ambientales significativos potenciales del transporte, uso, tratamiento final y disposición.',
        correct: true,
        why: 'Se debe proporcionar esa información a las partes pertinentes.'
      },
      {
        id: 'e',
        text: 'Controlar solamente lo que ocurre dentro del perímetro de la planta.',
        correct: false,
        why: 'La norma exige una perspectiva de ciclo de vida.'
      },
      {
        id: 'f',
        text: 'Los contratistas son responsables de todo; la organización no necesita influir.',
        correct: false,
        why: 'Debe controlar o influir según su capacidad, y conservarlo documentado.'
      }
    ]
  },
  {
    id: '912',
    clause: 9,
    ref: '§9.1.2 / 9.2 / 9.3',
    kind: 'classify',
    title: 'No confundir evaluación del cumplimiento, auditoría interna y revisión por la dirección',
    intro:
      'Son tres mecanismos distintos de la cláusula 9. Asigna cada actividad al requisito correcto.',
    xp: 120,
    successMessage: 'Cláusula 9: distingues evaluación del cumplimiento, auditoría y revisión.',
    categories: [
      { id: 'c912', label: '9.1.2 Evaluación del cumplimiento' },
      { id: 'c92', label: '9.2 Auditoría interna' },
      { id: 'c93', label: '9.3 Revisión por la dirección' }
    ],
    items: [
      {
        id: 'a',
        text: 'Comparar trimestralmente los monitoreos de efluentes contra la matriz de obligaciones de cumplimiento.',
        answer: 'c912',
        why: 'Evalúa el cumplimiento de cada obligación, con frecuencia definida.'
      },
      {
        id: 'b',
        text: 'Un auditor objetivo e imparcial revisa a intervalos planificados si el SGA cumple la norma y los requisitos propios.',
        answer: 'c92',
        why: 'Implica programa, criterios, alcance, frecuencia y objetividad de los auditores.'
      },
      {
        id: 'c',
        text: 'La Alta Dirección analiza desempeño, recursos, quejas y oportunidades para decidir si el SGA es conveniente, adecuado y eficaz.',
        answer: 'c93',
        why: 'La revisión la hace la Alta Dirección a intervalos planificados.'
      },
      {
        id: 'd',
        text: 'Conservar evidencia del estado de cumplimiento de cada requisito legal.',
        answer: 'c912',
        why: 'La norma pide conservar información documentada de los resultados de la evaluación.'
      },
      {
        id: 'e',
        text: 'Elaborar el programa anual de auditorías con alcance y frecuencia por proceso.',
        answer: 'c92',
        why: 'Es el programa de auditoría exigido por 9.2.2.'
      },
      {
        id: 'f',
        text: 'Decidir cambios al SGA, necesidades de recursos y oportunidades de mejora.',
        answer: 'c93',
        why: 'Son las salidas típicas de la revisión por la dirección.'
      }
    ]
  },
  {
    id: '93',
    clause: 9,
    ref: '§9.3',
    kind: 'select',
    title: 'Revisión por la dirección: entradas obligatorias',
    intro:
      'El auditor pedirá el acta de la última revisión. Marca únicamente las entradas que la cláusula 9.3.2 exige considerar.',
    xp: 150,
    successMessage: 'Cláusula 9.3: entradas de la revisión por la dirección completas.',
    items: [
      {
        id: 'a',
        text: 'Estado de las acciones de revisiones por la dirección anteriores.',
        correct: true,
        why: 'Da continuidad entre revisiones.'
      },
      {
        id: 'b',
        text: 'Cambios en cuestiones externas e internas, necesidades de partes interesadas, aspectos significativos, riesgos y oportunidades.',
        correct: true,
        why: 'Conecta la revisión con las cláusulas 4 y 6.'
      },
      {
        id: 'c',
        text: 'Grado de cumplimiento de los objetivos ambientales.',
        correct: true,
        why: 'Es información de desempeño exigida.'
      },
      {
        id: 'd',
        text: 'No conformidades, resultados de seguimiento y medición, cumplimiento de obligaciones y resultados de auditorías.',
        correct: true,
        why: 'Resume el desempeño ambiental del SGA.'
      },
      {
        id: 'e',
        text: 'Adecuación de los recursos.',
        correct: true,
        why: 'Conecta con el 7.1 y con la decisión de asignar recursos.'
      },
      {
        id: 'f',
        text: 'Comunicaciones pertinentes de partes interesadas, incluidas las quejas.',
        correct: true,
        why: 'Conecta con el 7.4.'
      },
      {
        id: 'g',
        text: 'Oportunidades de mejora continua.',
        correct: true,
        why: 'Alimenta la cláusula 10.3.'
      },
      {
        id: 'h',
        text: 'Ranking de ventas por vendedor.',
        correct: false,
        why: 'Es información comercial, no del SGA.'
      },
      {
        id: 'i',
        text: 'Resultado financiero del área comercial.',
        correct: false,
        why: 'No es una entrada exigida por 9.3.2.'
      },
      {
        id: 'j',
        text: 'Calendario de cumpleaños del personal.',
        correct: false,
        why: 'No aporta a la evaluación del SGA.'
      }
    ]
  },
  {
    id: '103',
    clause: 10,
    ref: '§10.2 / 10.3',
    kind: 'classify',
    title: 'Corrección, acción correctiva y mejora continua',
    intro:
      'La corrección trata el efecto; la acción correctiva elimina la causa raíz para que no se repita; la mejora continua busca aumentar el desempeño aunque no exista una no conformidad.',
    xp: 150,
    successMessage: 'Cláusula 10: diferencias entre corrección, acción correctiva y mejora continua.',
    categories: [
      { id: 'corr', label: 'Corrección (efecto)' },
      { id: 'ca', label: 'Acción correctiva (causa)' },
      { id: 'mc', label: 'Mejora continua' }
    ],
    items: [
      {
        id: 'a',
        text: 'Recoger el derrame y limpiar el suelo afectado.',
        answer: 'corr',
        why: 'Controla y corrige la consecuencia inmediata.'
      },
      {
        id: 'b',
        text: 'Construir una losa con dique para eliminar la causa raíz de los derrames recurrentes del almacén.',
        answer: 'ca',
        why: 'Actúa sobre la causa para evitar la repetición.'
      },
      {
        id: 'c',
        text: 'Instalar paneles solares para bajar la huella de carbono aunque ningún requisito lo exija.',
        answer: 'mc',
        why: 'No responde a una no conformidad: eleva el desempeño.'
      },
      {
        id: 'd',
        text: 'Contener la fuga de la brida y avisar al supervisor.',
        answer: 'corr',
        why: 'Reacciona ante la no conformidad y controla el efecto.'
      },
      {
        id: 'e',
        text: 'Cambiar el procedimiento de mantenimiento y capacitar tras hallar la brida defectuosa como causa raíz.',
        answer: 'ca',
        why: 'Elimina la causa y se verifica su eficacia.'
      },
      {
        id: 'f',
        text: 'Optimizar el proceso para reducir otro 5% el consumo de agua cada año.',
        answer: 'mc',
        why: 'Es mejora continua de la idoneidad y eficacia del SGA.'
      }
    ]
  }
];

export const getExercisesByClause = (clause: number): Exercise[] =>
  clauseExercises.filter((exercise) => exercise.clause === clause);
