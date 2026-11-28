import { RemoveLegacyUserRole1794484800000 } from './migrations/1794484800000-RemoveLegacyUserRole.js';
import { AddBackendRoleSchema1794312000000 } from './migrations/1794312000000-AddBackendRoleSchema.js';
import { BridgeLegacyUserAdministration1794398400000 } from './migrations/1794398400000-BridgeLegacyUserAdministration.js';
import { UnifyUserRoleAssignments1794312002000 } from './migrations/1794312002000-UnifyUserRoleAssignments.js';
import { SeedBackendRoles1794312001000 } from './migrations/1794312001000-SeedBackendRoles.js';
import { AddOperationalDocumentData1794225602000 } from './migrations/1794225602000-AddOperationalDocumentData.js';
import { AddCancellationRequests1794225603000 } from './migrations/1794225603000-AddCancellationRequests.js';
import { AddCancellationPermissions1794225604000 } from './migrations/1794225604000-AddCancellationPermissions.js';
import { AddQuoteEditVersion1794225601000 } from './migrations/1794225601000-AddQuoteEditVersion.js';
import { InitialSchema1730750400000 } from './migrations/1730750400000-InitialSchema.js';
import { AddQualityCertificates1730750401000 } from './migrations/1730750401000-AddQualityCertificates.js';
import { AddCertificateValidationToken1730750402000 } from './migrations/1730750402000-AddCertificateValidationToken.js';
import { AddDocumentFormatVersioning1793750400000 } from './migrations/1793750400000-AddDocumentFormatVersioning.js';
import { ResetCertificateSequenceToThreeDigits1793754000000 } from './migrations/1793754000000-ResetCertificateSequenceToThreeDigits.js';
import { ExtendDocumentSequences1793757600000 } from './migrations/1793757600000-ExtendDocumentSequences.js';
import { AddClienteDocumentFields1793813200000 } from './migrations/1793813200000-AddClienteDocumentFields.js';
import { CreateAuditoria1793813300000 } from './migrations/1793813300000-CreateAuditoria.js';
import { AddTemplateResponsible1793813400000 } from './migrations/1793813400000-AddTemplateResponsible.js';
import { AddPdfRendererVersion1793813500000 } from './migrations/1793813500000-AddPdfRendererVersion.js';
import { AddUsersAndCertificationSeals1793813600000 } from './migrations/1793813600000-AddUsersAndCertificationSeals.js';
import { ExtendAuditoriaEvents1793813700000 } from './migrations/1793813700000-ExtendAuditoriaEvents.js';
import { AddScopedRbac1794096000000 } from './migrations/1794096000000-AddScopedRbac.js';
import { ScopeQuotePilot1794096001000 } from './migrations/1794096001000-ScopeQuotePilot.js';
import { AddVersionedIva1794225600000 } from './migrations/1794225600000-AddVersionedIva.js';
import { AddPasswordVersion1794413600000 } from './migrations/1794413600000-AddPasswordVersion.js';
import { CreatePasswordResetTokens1794413660000 } from './migrations/1794413660000-CreatePasswordResetTokens.js';
import { AddQuoteCommercialConditions1794500000000 } from './migrations/1794500000000-AddQuoteCommercialConditions.js';
import { AddActaEventsAndLogisticsFormats1794600000000 } from './migrations/1794600000000-AddActaEventsAndLogisticsFormats.js';
import { AddProductCatalog1794700000000 } from './migrations/1794700000000-AddProductCatalog.js';
import { AddQuoteItemCatalogSnapshots1794800000000 } from './migrations/1794800000000-AddQuoteItemCatalogSnapshots.js';
import { EnableGeneralManager1794900000000 } from './migrations/1794900000000-EnableGeneralManager.js';
import { RevokeQuoteDeletion1795000000000 } from './migrations/1795000000000-RevokeQuoteDeletion.js';
import { AllowMultipleOrdersPerQuote1795100000000 } from './migrations/1795100000000-AllowMultipleOrdersPerQuote.js';
import { CicloMaterialesProcesados1795200000000 } from './migrations/1795200000000-CicloMaterialesProcesados.js';
import { MaterialesCantidadDecimal1795300000000 } from './migrations/1795300000000-MaterialesCantidadDecimal.js';
import { OrdenCompraCliente1795400000000 } from './migrations/1795400000000-OrdenCompraCliente.js';
import { RecepcionLogistica1795500000000 } from './migrations/1795500000000-RecepcionLogistica.js';
import { DocumentosEmitidos1795600000000 } from './migrations/1795600000000-DocumentosEmitidos.js';
import { ObservacionesSeparadasOrden1795700000000 } from './migrations/1795700000000-ObservacionesSeparadasOrden.js';
import { AddQuoteOperationalScope1795800000000 } from './migrations/1795800000000-AddQuoteOperationalScope.js';
import { AddLogisticsDriversRoutes1795900000000 } from './migrations/1795900000000-AddLogisticsDriversRoutes.js';
import { DynamicQuoteDocuments1796000000000 } from './migrations/1796000000000-DynamicQuoteDocuments.js';
import { ActaServicePhases1796100000000 } from './migrations/1796100000000-ActaServicePhases.js';
import { AllowRepeatedOrderEvents1796200000000 } from './migrations/1796200000000-AllowRepeatedOrderEvents.js';
import { CertificateCancellation1796300000000 } from './migrations/1796300000000-CertificateCancellation.js';
import { BackfillIssuedQuotes1796400000000 } from './migrations/1796400000000-BackfillIssuedQuotes.js';
import { ReprocessApprovals1796500000000 } from './migrations/1796500000000-ReprocessApprovals.js';
import { EnablePlantReprocessApproval1796600000000 } from './migrations/1796600000000-EnablePlantReprocessApproval.js';
import { AddClienteActivo1796700000000 } from './migrations/1796700000000-AddClienteActivo.js';
import { RevokePlantCertificateElaboration1796800000000 } from './migrations/1796800000000-RevokePlantCertificateElaboration.js';

/** Shared by the CLI and isolated migration rehearsals; does not load environment variables. */
export const DATABASE_MIGRATIONS = [
  InitialSchema1730750400000,
  AddQualityCertificates1730750401000,
  AddCertificateValidationToken1730750402000,
  AddDocumentFormatVersioning1793750400000,
  ResetCertificateSequenceToThreeDigits1793754000000,
  ExtendDocumentSequences1793757600000,
  AddClienteDocumentFields1793813200000,
  CreateAuditoria1793813300000,
  AddTemplateResponsible1793813400000,
  AddPdfRendererVersion1793813500000,
  AddUsersAndCertificationSeals1793813600000,
  ExtendAuditoriaEvents1793813700000,
  AddScopedRbac1794096000000,
  ScopeQuotePilot1794096001000,
  AddVersionedIva1794225600000,
  AddQuoteEditVersion1794225601000,
  AddOperationalDocumentData1794225602000,
  AddCancellationRequests1794225603000,
  AddCancellationPermissions1794225604000,
  AddBackendRoleSchema1794312000000,
  SeedBackendRoles1794312001000,
  UnifyUserRoleAssignments1794312002000,
  BridgeLegacyUserAdministration1794398400000,
  AddPasswordVersion1794413600000,
  CreatePasswordResetTokens1794413660000,
  RemoveLegacyUserRole1794484800000,
  AddQuoteCommercialConditions1794500000000,
  AddActaEventsAndLogisticsFormats1794600000000,
  AddProductCatalog1794700000000,
  AddQuoteItemCatalogSnapshots1794800000000,
  EnableGeneralManager1794900000000,
  RevokeQuoteDeletion1795000000000,
  AllowMultipleOrdersPerQuote1795100000000,
  CicloMaterialesProcesados1795200000000,
  MaterialesCantidadDecimal1795300000000,
  OrdenCompraCliente1795400000000,
  RecepcionLogistica1795500000000,
  DocumentosEmitidos1795600000000,
  ObservacionesSeparadasOrden1795700000000,
  AddQuoteOperationalScope1795800000000,
  AddLogisticsDriversRoutes1795900000000,
  DynamicQuoteDocuments1796000000000,
  ActaServicePhases1796100000000,
  AllowRepeatedOrderEvents1796200000000,
  CertificateCancellation1796300000000,
  BackfillIssuedQuotes1796400000000,
  ReprocessApprovals1796500000000,
  EnablePlantReprocessApproval1796600000000,
  AddClienteActivo1796700000000,
  RevokePlantCertificateElaboration1796800000000,
];
