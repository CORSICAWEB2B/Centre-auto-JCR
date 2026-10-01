# Vidéo d'arrière-plan du Hero (Centre Auto JCR)

Ce dossier `public/` contient les fichiers statiques servis à la racine de votre site web sur GitHub et Cloudflare Pages / Workers.

## Emplacement de la vidéo :
- **Fichier** : `public/hero-video.mp4`
- **URL relative utilisée par l'application** : `/hero-video.mp4`

## Fonctionnement lors du déploiement :
1. Lors de l'exécution de `npm run build`, Vite copie automatiquement tout le contenu du dossier `public/` dans le dossier de distribution `dist/`.
2. Le fichier `hero-video.mp4` se retrouve ainsi à la racine `dist/hero-video.mp4`.
3. Sur **Cloudflare Pages / Workers**, la vidéo est servie en streaming direct (compatible `Range requests`, `autoplay`, `muted`, `loop` et `playsinline`).

## Comment remplacer ou mettre à jour la vidéo manuellement :
1. Placez votre fichier vidéo au format MP4 directement dans ce dossier sous le nom :
   `public/hero-video.mp4`
2. Effectuez votre commit et push vers GitHub :
   ```bash
   git add public/hero-video.mp4
   git commit -m "Mise à jour de la vidéo du hero"
   git push
   ```
3. Cloudflare redéploiera automatiquement le site avec votre vidéo.
