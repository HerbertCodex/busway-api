/** @format */
import { seed } from './seed';

seed()
  .then(() => {
    console.log('🌱 Seed terminé avec succès.');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Erreur pendant le seed :', err);
    process.exit(1);
  });
