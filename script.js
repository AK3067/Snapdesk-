const galleryData = [
    { src: "https://via.placeholder.com/300x200?text=Photo+1.jpg", name: "Photo 1.jpg", date: "2023-06-01" },
    { src: "https://via.placeholder.com/300x200?text=Photo+2.png", name: "Photo 2.png", date: "2023-06-02" },
    { src: "https://file-examples-com.github.io/uploads/2017/08/file_example_PPT_500kB.ppt", name: "Presentation.ppt", date: "2023-06-03" },
    { src: "https://file-examples-com.github.io/uploads/2017/02/file_example_XLS_10.xls", name: "Spreadsheet.xls", date: "2023-06-04" },
    { src: "https://file-examples-com.github.io/uploads/2017/02/file-sample_100kB.doc", name: "Document.doc", date: "2023-06-05" },
    { src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", name: "Video.mp4", date: "2023-06-06" },
    { src: "https://via.placeholder.com/300x200?text=Photo+3.gif", name: "Photo 3.gif", date: "2023-06-07" },
];

const albumsData = [
    { name: "Recents", cover: "https://via.placeholder.com/300x200?text=Friends", items: [
        { src: "https://via.placeholder.com/300x200?text=Friends+Photo", name: "FriendsPhoto.jpg", date: "2023-06-01" }
    ] },
    { name: "Images", cover: "https://via.placeholder.com/300x200?text=Vacation", items: [
        { src: "https://via.placeholder.com/300x200?text=Beach", name: "Beach.jpg", date: "2023-06-02" },
        { src: "https://via.placeholder.com/300x200?text=Mountain", name: "Mountain.jpg", date: "2023-06-03" }
    ] },
    { name: "Videos", cover: "https://via.placeholder.com/300x200?text=Work", items: [
        { src: "https://file-examples-com.github.io/uploads/2017/08/file_example_PPT_500kB.ppt", name: "Presentation.ppt", date: "2023-06-04" }
    ] },
    { name: "Documents", cover: "https://via.placeholder.com/300x200?text=Family", items: [
        { src: "https://via.placeholder.com/300x200?text=Family+Photo", name: "FamilyPhoto.jpg", date: "2023-06-05" }
    ] },
];

const icons = {
    ppt: "ppt-logo.png", // Use the new PPT logo image
    xls: "https://drive.google.com/file/d/1yzU7IbAyQlQfNpujuWWaYDGRAcUgJ5RQ/view?usp=drive_link",
    doc: "https://drive.google.com/file/d/1cC2X8cRJLrdxChSVV1sEi8j_VQpjcn2H/view?usp=drive_link",
    pdf: "https://drive.google.com/file/d/1Rjpc_u9rk22UqNvB8H2j5mPB_wtMMY2K/view?usp=drive_link",
    generic: "https://cdn-icons-png.flaticon.com/512/136/136539.png",
};

const galleryContainer = document.querySelector(".gallery-container");
const previewModal = document.getElementById("preview-modal");
const previewArea = document.getElementById("preview-area");
const closePreviewBtn = document.getElementById("close-preview");

function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
}

function createGalleryItem(item) {
    const div = document.createElement("div");
    div.classList.add("gallery-item");
    div.dataset.src = item.src;
    div.dataset.name = item.name;

    const ext = getFileExtension(item.name);
    div.dataset.type = ext;

    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) {

        const img = document.createElement("img");
        img.src = item.src;
        img.alt = item.name;
        img.loading = "lazy";
        img.addEventListener("error", () => {
            img.src = icons.generic;
            img.alt = "Image not available";
        });
        div.appendChild(img);
    } else if (["mp4", "webm", "ogg"].includes(ext)) {
        const icon = document.createElement("img");
        icon.src = "https://cdn-icons-png.flaticon.com/512/727/727245.png"; // video icon
        icon.alt = "video icon";
        icon.classList.add("icon");
        div.appendChild(icon);
    } else {
        const icon = document.createElement("img");
        icon.src = icons[ext] || icons.generic;
        icon.alt = ext + " icon";
        icon.classList.add("icon");
        div.appendChild(icon);
    }

    const filename = document.createElement("div");
    filename.classList.add("filename");
    filename.textContent = item.name;
    div.appendChild(filename);

    div.addEventListener("click", () => {
        openPreview(item);
    });

    return div;
}


function createAlbumItem(album) {
    const div = document.createElement("div");
    div.classList.add("gallery-item");
    div.dataset.type = "album";
    div.dataset.name = album.name;

    const img = document.createElement("img");
    img.src = album.cover || icons.folder;
    img.alt = album.name;
    div.appendChild(img);

    const filename = document.createElement("div");
    filename.classList.add("filename");
    filename.textContent = album.name;
    div.appendChild(filename);

    div.addEventListener("click", () => {
        openAlbum(album);
    });

    return div;
}

let currentAlbum = null;

function openAlbum(album) {
    currentAlbum = album;
    showingAlbums = false;
    galleryContainer.innerHTML = "";

    // Special albums: Images, Videos, Documents
    if (["Images", "Videos", "Documents"].includes(album.name)) {
        renderGallery();
    } else {
        // Sort album items by date descending
        const sortedItems = album.items.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
        sortedItems.forEach(item => {
            const galleryItem = createGalleryItem(item);
            galleryContainer.appendChild(galleryItem);
        });
    }
    updateNavButtons();
}

function updateNavButtons() {
    const btnAll = document.getElementById("btn-all");
    const btnAlbum = document.getElementById("btn-album");

    if (currentAlbum) {
        btnAll.classList.remove("active");
        btnAlbum.classList.add("active");
    } else {
        btnAll.classList.add("active");
        btnAlbum.classList.remove("active");
    }
}

document.getElementById("btn-all").addEventListener("click", () => {
    currentAlbum = null;
    showingAlbums = false;
    renderGallery();
    updateNavButtons();
});

document.getElementById("btn-album").addEventListener("click", () => {
    currentAlbum = null;
    showingAlbums = true;
    renderGallery();
    updateNavButtons();
});

let currentPreviewIndex = -1;
let currentPreviewItems = [];

function openPreview(item) {
    previewArea.innerHTML = "";
    const ext = getFileExtension(item.name);

    // Determine current preview items and index
    if (currentAlbum) {
        currentPreviewItems = currentAlbum.items;
    } else if (showingAlbums) {
        currentPreviewItems = [];
    } else {
        currentPreviewItems = galleryData;
    }
    currentPreviewIndex = currentPreviewItems.findIndex(i => i.name === item.name);

    let isImage = ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext);
    if (isImage) {
        const img = document.createElement("img");
        img.src = item.src;
        img.alt = item.name;
        img.loading = "lazy";
        img.style.display = "block";
        img.style.margin = "0 auto";
        img.addEventListener("error", () => {
            img.src = icons.generic;
            img.alt = "Image not available";
        });
        previewArea.appendChild(img);

        // --- Action Toolbar ---
        const toolbar = document.createElement('div');
        toolbar.className = 'image-action-toolbar';
        toolbar.style.display = 'flex';
        toolbar.style.justifyContent = 'center';
        toolbar.style.gap = '16px';
        toolbar.style.margin = '18px 0 8px 0';
        toolbar.innerHTML = `
            <button class="img-action-btn" id="img-share-btn">Share</button>
            <button class="img-action-btn" id="img-rename-btn">Rename</button>
            <button class="img-action-btn" id="img-delete-btn">Delete</button>
            <button class="img-action-btn" id="img-edit-btn">Edit</button>
            <div style="position:relative;display:inline-block;">
                <button class="img-action-btn" id="img-more-btn">More &#x25BC;</button>
                <div id="img-more-menu" style="display:none;position:absolute;left:0;top:110%;background:#222;border-radius:8px;box-shadow:0 2px 12px #000a;padding:8px 0;z-index:10;min-width:180px;">
                    <button class="img-more-item" id="img-wallpaper-btn" style="width:100%;text-align:left;padding:8px 18px;background:none;border:none;color:#fff;">Set as Wallpaper</button>
                    <button class="img-more-item" id="img-detail-btn" style="width:100%;text-align:left;padding:8px 18px;background:none;border:none;color:#fff;">Detail</button>
                    <button class="img-more-item" id="img-lens-btn" style="width:100%;text-align:left;padding:8px 18px;background:none;border:none;color:#fff;">Google Lens</button>
                    <button class="img-more-item" id="img-move-album-btn" style="width:100%;text-align:left;padding:8px 18px;background:none;border:none;color:#fff;">Move to Album</button>
                    <button class="img-more-item" id="img-move-profile-btn" style="width:100%;text-align:left;padding:8px 18px;background:none;border:none;color:#fff;">Move to Profile</button>
                </div>
            </div>
        `;
        previewArea.appendChild(toolbar);

        // --- Toolbar Button Logic ---
        document.getElementById('img-share-btn').onclick = function() {
            if (navigator.share) {
                navigator.share({ title: item.name, url: item.src });
            } else {
                prompt('Copy image URL:', item.src);
            }
        };
        document.getElementById('img-rename-btn').onclick = function() {
            const newName = prompt('Rename image:', item.name);
            if (newName && newName !== item.name) {
                item.name = newName;
                renderGallery();
                openPreview(item);
            }
        };
        document.getElementById('img-delete-btn').onclick = function() {
            if (confirm('Delete this image?')) {
                // Remove from galleryData and currentAlbum if present
                let idx = galleryData.findIndex(i => i.name === item.name && i.date === item.date);
                if (idx !== -1) galleryData.splice(idx, 1);
                if (currentAlbum && currentAlbum.items) {
                    let aidx = currentAlbum.items.findIndex(i => i.name === item.name && i.date === item.date);
                    if (aidx !== -1) currentAlbum.items.splice(aidx, 1);
                }
                renderGallery();
                closePreview();
            }
        };
        document.getElementById('img-edit-btn').onclick = function() {
            alert('Edit feature not implemented.');
        };
        // More menu logic
        const moreBtn = document.getElementById('img-more-btn');
        const moreMenu = document.getElementById('img-more-menu');
        moreBtn.onclick = function(e) {
            e.stopPropagation();
            moreMenu.style.display = moreMenu.style.display === 'block' ? 'none' : 'block';
        };
        document.addEventListener('click', function hideMenu(e) {
            if (!moreMenu.contains(e.target) && e.target !== moreBtn) {
                moreMenu.style.display = 'none';
                document.removeEventListener('click', hideMenu);
            }
        });
        document.getElementById('img-wallpaper-btn').onclick = function() {
            alert('Set as wallpaper feature is not available in browser.');
        };
        document.getElementById('img-detail-btn').onclick = function() {
            alert('Name: ' + item.name + '\nDate: ' + item.date + '\nURL: ' + item.src);
        };
        document.getElementById('img-lens-btn').onclick = function() {
            window.open('https://lens.google.com/uploadbyurl?url=' + encodeURIComponent(item.src), '_blank');
        };
        document.getElementById('img-move-album-btn').onclick = function() {
            let albumNames = albumsData.filter(a => a.name !== 'Recents' && a.name !== 'Images' && a.name !== 'Videos' && a.name !== 'Documents').map(a => a.name);
            let msg = 'Move to album:\n' + albumNames.map((n, i) => `${i + 1}. ${n}`).join('\n');
            let idx = parseInt(prompt(msg), 10) - 1;
            if (idx >= 0 && idx < albumNames.length) {
                let album = albumsData.find(a => a.name === albumNames[idx]);
                if (album) {
                    album.items.push(item);
                    // Remove from current album if needed
                    if (currentAlbum && currentAlbum.items) {
                        let aidx = currentAlbum.items.findIndex(i => i.name === item.name && i.date === item.date);
                        if (aidx !== -1) currentAlbum.items.splice(aidx, 1);
                    }
                    renderGallery();
                    closePreview();
                }
            }
        };
        document.getElementById('img-move-profile-btn').onclick = function() {
            if (profiles.length < 2) {
                alert('No other profiles to move to.');
                return;
            }
            let msg = 'Move to profile:\n';
            profiles.forEach((p, i) => {
                if (i !== currentProfileIndex && !p.hidden) msg += `${i + 1}. ${p.name}\n`;
            });
            const idx = parseInt(prompt(msg), 10) - 1;
            if (idx >= 0 && idx < profiles.length && idx !== currentProfileIndex && !profiles[idx].hidden) {
                let albumName = 'Recents';
                if (currentAlbum) albumName = currentAlbum.name;
                moveItemToProfile(item, currentProfileIndex, idx, albumName);
                closePreview();
            }
        };
    } else if (["mp4", "webm", "ogg"].includes(ext)) {
        const video = document.createElement("video");
        video.src = item.src;
        video.controls = true;
        video.autoplay = true;
        video.loading = "lazy";
        video.style.maxWidth = "100%";
        video.style.maxHeight = "80vh";
        video.addEventListener("error", () => {
            const errorMsg = document.createElement("div");
            errorMsg.textContent = "Video failed to load.";
            errorMsg.style.color = "red";
            previewArea.innerHTML = "";
            previewArea.appendChild(errorMsg);
        });
        previewArea.appendChild(video);

        // --- Video Action Toolbar ---
        const toolbar = document.createElement('div');
        toolbar.className = 'video-action-toolbar';
        toolbar.style.display = 'flex';
        toolbar.style.justifyContent = 'center';
        toolbar.style.gap = '16px';
        toolbar.style.margin = '18px 0 8px 0';
        toolbar.innerHTML = `
            <button class="video-action-btn" id="video-share-btn">Share</button>
            <button class="video-action-btn" id="video-rename-btn">Rename</button>
            <button class="video-action-btn" id="video-delete-btn">Delete</button>
            <button class="video-action-btn" id="video-edit-btn">Edit</button>
            <div style="position:relative;display:inline-block;">
                <button class="video-action-btn" id="video-more-btn">More &#x25BC;</button>
                <div id="video-more-menu" style="display:none;position:absolute;left:0;top:110%;background:#222;border-radius:8px;box-shadow:0 2px 12px #000a;padding:8px 0;z-index:10;min-width:180px;">
                    <button class="video-more-item" id="video-detail-btn" style="width:100%;text-align:left;padding:8px 18px;background:none;border:none;color:#fff;">Detail</button>
                    <button class="video-more-item" id="video-move-album-btn" style="width:100%;text-align:left;padding:8px 18px;background:none;border:none;color:#fff;">Move to Album</button>
                    <button class="video-more-item" id="video-move-profile-btn" style="width:100%;text-align:left;padding:8px 18px;background:none;border:none;color:#fff;">Move to Profile</button>
                </div>
            </div>
        `;
        previewArea.appendChild(toolbar);

        // --- Toolbar Button Logic ---
        document.getElementById('video-share-btn').onclick = function() {
            if (navigator.share) {
                navigator.share({ title: item.name, url: item.src });
            } else {
                prompt('Copy video URL:', item.src);
            }
        };
        document.getElementById('video-rename-btn').onclick = function() {
            const newName = prompt('Rename video:', item.name);
            if (newName && newName !== item.name) {
                item.name = newName;
                renderGallery();
                openPreview(item);
            }
        };
        document.getElementById('video-delete-btn').onclick = function() {
            if (confirm('Delete this video?')) {
                let idx = galleryData.findIndex(i => i.name === item.name && i.date === item.date);
                if (idx !== -1) galleryData.splice(idx, 1);
                if (currentAlbum && currentAlbum.items) {
                    let aidx = currentAlbum.items.findIndex(i => i.name === item.name && i.date === item.date);
                    if (aidx !== -1) currentAlbum.items.splice(aidx, 1);
                }
                renderGallery();
                closePreview();
            }
        };
        document.getElementById('video-edit-btn').onclick = function() {
            alert('Edit feature not implemented.');
        };
        // More menu logic
        const moreBtn = document.getElementById('video-more-btn');
        const moreMenu = document.getElementById('video-more-menu');
        moreBtn.onclick = function(e) {
            e.stopPropagation();
            moreMenu.style.display = moreMenu.style.display === 'block' ? 'none' : 'block';
        };
        document.addEventListener('click', function hideMenu(e) {
            if (!moreMenu.contains(e.target) && e.target !== moreBtn) {
                moreMenu.style.display = 'none';
                document.removeEventListener('click', hideMenu);
            }
        });
        document.getElementById('video-detail-btn').onclick = function() {
            alert('Name: ' + item.name + '\nDate: ' + item.date + '\nURL: ' + item.src);
        };
        document.getElementById('video-move-album-btn').onclick = function() {
            let albumNames = albumsData.filter(a => a.name !== 'Recents' && a.name !== 'Images' && a.name !== 'Videos' && a.name !== 'Documents').map(a => a.name);
            let msg = 'Move to album:\n' + albumNames.map((n, i) => `${i + 1}. ${n}`).join('\n');
            let idx = parseInt(prompt(msg), 10) - 1;
            if (idx >= 0 && idx < albumNames.length) {
                let album = albumsData.find(a => a.name === albumNames[idx]);
                if (album) {
                    album.items.push(item);
                    if (currentAlbum && currentAlbum.items) {
                        let aidx = currentAlbum.items.findIndex(i => i.name === item.name && i.date === item.date);
                        if (aidx !== -1) currentAlbum.items.splice(aidx, 1);
                    }
                    renderGallery();
                    closePreview();
                }
            }
        };
        document.getElementById('video-move-profile-btn').onclick = function() {
            if (profiles.length < 2) {
                alert('No other profiles to move to.');
                return;
            }
            let msg = 'Move to profile:\n';
            profiles.forEach((p, i) => {
                if (i !== currentProfileIndex && !p.hidden) msg += `${i + 1}. ${p.name}\n`;
            });
            const idx = parseInt(prompt(msg), 10) - 1;
            if (idx >= 0 && idx < profiles.length && idx !== currentProfileIndex && !profiles[idx].hidden) {
                let albumName = 'Recents';
                if (currentAlbum) albumName = currentAlbum.name;
                moveItemToProfile(item, currentProfileIndex, idx, albumName);
                closePreview();
            }
        };
    } else {
        // For documents, embed in iframe if possible, else show link
        const iframe = document.createElement("iframe");
        iframe.src = item.src;
        iframe.title = item.name;
        iframe.addEventListener("error", () => {
            const errorMsg = document.createElement("div");
            errorMsg.textContent = "Document failed to load.";
            errorMsg.style.color = "red";
            previewArea.innerHTML = "";
            previewArea.appendChild(errorMsg);
        });
        previewArea.appendChild(iframe);

        // --- Document Action Toolbar ---
        const toolbar = document.createElement('div');
        toolbar.className = 'doc-action-toolbar';
        toolbar.style.display = 'flex';
        toolbar.style.justifyContent = 'center';
        toolbar.style.gap = '16px';
        toolbar.style.margin = '18px 0 8px 0';
        toolbar.innerHTML = `
            <button class="doc-action-btn" id="doc-share-btn">Share</button>
            <button class="doc-action-btn" id="doc-rename-btn">Rename</button>
            <button class="doc-action-btn" id="doc-delete-btn">Delete</button>
            <button class="doc-action-btn" id="doc-edit-btn">Edit</button>
            <div style="position:relative;display:inline-block;">
                <button class="doc-action-btn" id="doc-more-btn">More &#x25BC;</button>
                <div id="doc-more-menu" style="display:none;position:absolute;left:0;top:110%;background:#222;border-radius:8px;box-shadow:0 2px 12px #000a;padding:8px 0;z-index:10;min-width:180px;">
                    <button class="doc-more-item" id="doc-detail-btn" style="width:100%;text-align:left;padding:8px 18px;background:none;border:none;color:#fff;">Detail</button>
                    <button class="doc-more-item" id="doc-move-album-btn" style="width:100%;text-align:left;padding:8px 18px;background:none;border:none;color:#fff;">Move to Album</button>
                    <button class="doc-more-item" id="doc-move-profile-btn" style="width:100%;text-align:left;padding:8px 18px;background:none;border:none;color:#fff;">Move to Profile</button>
                </div>
            </div>
        `;
        previewArea.appendChild(toolbar);

        // --- Toolbar Button Logic ---
        document.getElementById('doc-share-btn').onclick = function() {
            if (navigator.share) {
                navigator.share({ title: item.name, url: item.src });
            } else {
                prompt('Copy document URL:', item.src);
            }
        };
        document.getElementById('doc-rename-btn').onclick = function() {
            const newName = prompt('Rename document:', item.name);
            if (newName && newName !== item.name) {
                item.name = newName;
                renderGallery();
                openPreview(item);
            }
        };
        document.getElementById('doc-delete-btn').onclick = function() {
            if (confirm('Delete this document?')) {
                let idx = galleryData.findIndex(i => i.name === item.name && i.date === item.date);
                if (idx !== -1) galleryData.splice(idx, 1);
                if (currentAlbum && currentAlbum.items) {
                    let aidx = currentAlbum.items.findIndex(i => i.name === item.name && i.date === item.date);
                    if (aidx !== -1) currentAlbum.items.splice(aidx, 1);
                }
                renderGallery();
                closePreview();
            }
        };
        document.getElementById('doc-edit-btn').onclick = function() {
            // Show edit options based on file type
            const ext = getFileExtension(item.name);
            let options = [];
            if (ext === 'pdf') {
                options = [
                    'PDF to Word',
                    'PDF to PPT',
                    'PDF to Excel',
                    'PDF to Image',
                    'Set Password',
                    'Add Signature',
                    'Add Watermark'
                ];
            } else if (['doc', 'docx'].includes(ext)) {
                options = [
                    'Word to PDF',
                    'Set Password',
                    'Add Signature',
                    'Add Watermark'
                ];
            } else if (['ppt', 'pptx'].includes(ext)) {
                options = [
                    'PPT to PDF',
                    'Set Password',
                    'Add Signature',
                    'Add Watermark'
                ];
            } else if (['xls', 'xlsx'].includes(ext)) {
                options = [
                    'Excel to PDF',
                    'Set Password',
                    'Add Signature',
                    'Add Watermark'
                ];
            } else {
                options = [
                    'Convert to PDF',
                    'Set Password',
                    'Add Signature',
                    'Add Watermark'
                ];
            }
            let msg = 'Edit Options:\n' + options.map((o, i) => `${i + 1}. ${o}`).join('\n') + '\n\n(Feature not implemented)';
            alert(msg);
        };
        // More menu logic
        const moreBtn = document.getElementById('doc-more-btn');
        const moreMenu = document.getElementById('doc-more-menu');
        moreBtn.onclick = function(e) {
            e.stopPropagation();
            moreMenu.style.display = moreMenu.style.display === 'block' ? 'none' : 'block';
        };
        document.addEventListener('click', function hideMenu(e) {
            if (!moreMenu.contains(e.target) && e.target !== moreBtn) {
                moreMenu.style.display = 'none';
                document.removeEventListener('click', hideMenu);
            }
        });
        document.getElementById('doc-detail-btn').onclick = function() {
            alert('Name: ' + item.name + '\nDate: ' + item.date + '\nURL: ' + item.src);
        };
        document.getElementById('doc-move-album-btn').onclick = function() {
            let albumNames = albumsData.filter(a => a.name !== 'Recents' && a.name !== 'Images' && a.name !== 'Videos' && a.name !== 'Documents').map(a => a.name);
            let msg = 'Move to album:\n' + albumNames.map((n, i) => `${i + 1}. ${n}`).join('\n');
            let idx = parseInt(prompt(msg), 10) - 1;
            if (idx >= 0 && idx < albumNames.length) {
                let album = albumsData.find(a => a.name === albumNames[idx]);
                if (album) {
                    album.items.push(item);
                    if (currentAlbum && currentAlbum.items) {
                        let aidx = currentAlbum.items.findIndex(i => i.name === item.name && i.date === item.date);
                        if (aidx !== -1) currentAlbum.items.splice(aidx, 1);
                    }
                    renderGallery();
                    closePreview();
                }
            }
        };
        document.getElementById('doc-move-profile-btn').onclick = function() {
            if (profiles.length < 2) {
                alert('No other profiles to move to.');
                return;
            }
            let msg = 'Move to profile:\n';
            profiles.forEach((p, i) => {
                if (i !== currentProfileIndex && !p.hidden) msg += `${i + 1}. ${p.name}\n`;
            });
            const idx = parseInt(prompt(msg), 10) - 1;
            if (idx >= 0 && idx < profiles.length && idx !== currentProfileIndex && !profiles[idx].hidden) {
                let albumName = 'Recents';
                if (currentAlbum) albumName = currentAlbum.name;
                moveItemToProfile(item, currentProfileIndex, idx, albumName);
                closePreview();
            }
        };
    }
    previewModal.classList.remove("hidden");
}

function closePreview() {
    previewModal.classList.add("hidden");
    previewArea.innerHTML = "";
}

closePreviewBtn.addEventListener("click", closePreview);
previewModal.addEventListener("click", (e) => {
    if (e.target === previewModal) {
        closePreview();
    }
});

// Removed navigation arrow event listeners
// Added swipe gesture logic
previewModal.addEventListener("touchstart", (e) => {
    touchstartX = e.changedTouches[0].screenX;
});

previewModal.addEventListener("touchend", (e) => {
    touchendX = e.changedTouches[0].screenX;
    handleSwipeGesture();
});

previewModal.addEventListener("mousedown", (e) => {
    touchstartX = e.screenX;
});

previewModal.addEventListener("mouseup", (e) => {
    touchendX = e.screenX;
    handleSwipeGesture();
});

function handleSwipeGesture() {
    if (touchendX < touchstartX - 50) {
        navigateToNextItem();
    } else if (touchendX > touchstartX + 50) {
        navigateToPreviousItem();
    }
}

function navigateToPreviousItem() {
    if (currentPreviewIndex > 0) {
        currentPreviewIndex--;
    } else {
        currentPreviewIndex = currentPreviewItems.length - 1;
    }
    openPreview(currentPreviewItems[currentPreviewIndex]);
}

function navigateToNextItem() {
    if (currentPreviewIndex < currentPreviewItems.length - 1) {
        currentPreviewIndex++;
    } else {
        currentPreviewIndex = 0;
    }
    openPreview(currentPreviewItems[currentPreviewIndex]);
}

let showingAlbums = false;

// Update the top bar to match the UI in the image
function renderTopBar() {
    let topBar = document.getElementById('top-bar');
    if (!topBar) {
        topBar = document.createElement('div');
        topBar.id = 'top-bar';
        topBar.innerHTML = `
            <div class="top-bar-content">
                <div class="profile-section">
                    <img src="https://via.placeholder.com/40" alt="Profile" class="profile-avatar" />
                    <span class="profile-name">Sophia</span>
                </div>
                <div class="title-section">Gallery</div>
                <button class="add-button">+</button>
            </div>
        `;
        document.body.insertBefore(topBar, document.body.firstChild);
    }
}

// Call renderTopBar on load
renderTopBar();

// Ensure the gallery layout matches the image
function renderGallery() {
    const galleryGrid = document.querySelector(".gallery-grid");
    galleryGrid.innerHTML = "";

    galleryData.forEach(item => {
        const galleryItem = document.createElement("div");
        galleryItem.className = "gallery-item";
        galleryItem.innerHTML = `<img src="${item.src}" alt="${item.name}" />`;
        galleryGrid.appendChild(galleryItem);
    });
}

// Call renderGallery on load
renderGallery();

// Add swipe up and down animations for the bottom bar
(function enableSwipeForBottomBar() {
    const bottomBar = document.querySelector('.bottom-bar');
    let startY = null;
    let isHidden = false;
    const threshold = 30; // Minimum swipe distance

    function showBottomBar() {
        if (!isHidden) return;
        bottomBar.style.transform = 'translateY(0)';
        bottomBar.style.transition = 'transform 0.3s ease';
        isHidden = false;
    }

    function hideBottomBar() {
        if (isHidden) return;
        bottomBar.style.transform = 'translateY(100%)';
        bottomBar.style.transition = 'transform 0.3s ease';
        isHidden = true;
    }

    // Touch events
    document.addEventListener('touchstart', function (e) {
        if (e.touches.length !== 1) return;
        startY = e.touches[0].clientY;
    });

    document.addEventListener('touchmove', function (e) {
        if (startY === null) return;
        const deltaY = e.touches[0].clientY - startY;
        if (deltaY > threshold) {
            hideBottomBar();
            startY = null;
        } else if (deltaY < -threshold) {
            showBottomBar();
            startY = null;
        }
    });

    document.addEventListener('touchend', function () {
        startY = null;
    });

    // Mouse wheel (for desktop)
    window.addEventListener('wheel', function (e) {
        if (e.deltaY > 0) {
            hideBottomBar();
        } else {
            showBottomBar();
        }
    }, { passive: true });
})();

function renderAlbumInterface() {
    const galleryContainer = document.querySelector(".gallery-container");
    galleryContainer.innerHTML = "";

    const albumData = [
        { name: "Gallery View", icon: "https://via.placeholder.com/50", color: "#FFC107" },
        { name: "Snaps", icon: "https://via.placeholder.com/50", color: "#03A9F4" },
        { name: "Docs+", icon: "https://via.placeholder.com/50", color: "#8BC34A" },
        { name: "Other Spaces", icon: "https://via.placeholder.com/50", color: "#FF5722" },
        { name: "Recover Bin", icon: "https://via.placeholder.com/50", color: "#9E9E9E" },
        { name: "New Album", icon: "https://via.placeholder.com/50", color: "#673AB7" }
    ];

    albumData.forEach(album => {
        const albumItem = document.createElement("div");
        albumItem.className = "album-item";
        albumItem.style.backgroundColor = album.color;
        albumItem.innerHTML = `
            <img src="${album.icon}" alt="${album.name}" class="album-icon" />
            <span class="album-name">${album.name}</span>
        `;
        galleryContainer.appendChild(albumItem);
    });
}

// Update the album button click event
function renderAlbumSection() {
    renderAlbumInterface();
}

function renderSwipeLeftInterface() {
    const galleryContainer = document.querySelector(".gallery-container");
    galleryContainer.innerHTML = "";

    const swipeLeftData = [
        { name: "Gallery View", icon: "https://via.placeholder.com/50", color: "#FFC107" },
        { name: "Snaps", icon: "https://via.placeholder.com/50", color: "#03A9F4" },
        { name: "Docs+", icon: "https://via.placeholder.com/50", color: "#8BC34A" },
        { name: "Other Spaces", icon: "https://via.placeholder.com/50", color: "#FF5722" },
        { name: "Recover Bin", icon: "https://via.placeholder.com/50", color: "#9E9E9E" },
        { name: "New Album", icon: "https://via.placeholder.com/50", color: "#673AB7" }
    ];

    swipeLeftData.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "swipe-left-item";
        itemDiv.style.backgroundColor = item.color;
        itemDiv.innerHTML = `
            <img src="${item.icon}" alt="${item.name}" class="swipe-left-icon" />
            <span class="swipe-left-name">${item.name}</span>
        `;
        galleryContainer.appendChild(itemDiv);
    });
}

// Add swipe left gesture logic
(function enableSwipeLeftGesture() {
    const galleryContainer = document.querySelector(".gallery-container");
    let startX = null;

    galleryContainer.addEventListener('touchstart', function (e) {
        if (e.touches.length !== 1) return;
        startX = e.touches[0].clientX;
    });

    galleryContainer.addEventListener('touchend', function (e) {
        if (startX === null) return;
        const deltaX = e.changedTouches[0].clientX - startX;
        if (deltaX < -50) {
            renderSwipeLeftInterface();
        }
        startX = null;
    });
})();
