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

document.getElementById("prev-button").addEventListener("click", () => {
    if (currentPreviewIndex > 0) {
        currentPreviewIndex--;
    } else {
        currentPreviewIndex = currentPreviewItems.length - 1;
    }
    openPreview(currentPreviewItems[currentPreviewIndex]);
});

document.getElementById("next-button").addEventListener("click", () => {
    if (currentPreviewIndex < currentPreviewItems.length - 1) {
        currentPreviewIndex++;
    } else {
        currentPreviewIndex = 0;
    }
    openPreview(currentPreviewItems[currentPreviewIndex]);
});

let showingAlbums = false;

function renderGallery() {
    galleryContainer.innerHTML = "";
    // If showingAlbums, show album covers as before
    if (showingAlbums) {
        albumsData.forEach((album) => {
            const albumItem = createAlbumItem(album);
            galleryContainer.appendChild(albumItem);
        });
    } else if (currentAlbum) {
        // Custom logic for special albums
        let items = [];
        if (currentAlbum.name === "Images") {
            // Only images
            items = galleryData.filter(item => ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(getFileExtension(item.name)));
        } else if (currentAlbum.name === "Videos") {
            // Only videos
            items = galleryData.filter(item => ["mp4", "webm", "ogg"].includes(getFileExtension(item.name)));
        } else if (currentAlbum.name === "Documents") {
            // Only documents (not images or videos)
            items = galleryData.filter(item => !["jpg", "jpeg", "png", "gif", "bmp", "webp", "mp4", "webm", "ogg"].includes(getFileExtension(item.name)));
        } else {
            // Default: show album's own items
            items = currentAlbum.items.slice();
        }
        // Sort by date descending
        items = items.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
        items.forEach(item => {
            const galleryItem = createGalleryItem(item);
            galleryContainer.appendChild(galleryItem);
        });
    } else {
        // All: show all images, videos, and documents, sorted by date
        let items = galleryData.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
        items.forEach((item) => {
            const galleryItem = createGalleryItem(item);
            galleryContainer.appendChild(galleryItem);
        });
    }
}

// --- Top Bar UI ---
function renderTopBar() {
    let topBar = document.getElementById('top-bar');
    if (!topBar) {
        topBar = document.createElement('div');
        topBar.id = 'top-bar';
        topBar.innerHTML = `
            <div class="top-bar-overlay">
                <span class="top-title">Everything Here</span>
                <span class="top-search"><svg width="28" height="28" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="#fff" stroke-width="2" fill="none"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#fff" stroke-width="2"/></svg></span>
                <span class="top-count" id="item-count"></span>
            </div>
        `;
        document.body.insertBefore(topBar, document.body.firstChild);
    }
    updateItemCount();
}

function updateItemCount() {
    const countSpan = document.getElementById('item-count');
    if (!countSpan) return;
    let count = 0;
    if (showingAlbums) {
        albumsData.forEach(album => count += album.items.length);
    } else {
        count = galleryData.length;
    }
    countSpan.textContent = `${count} Items`;
}

// --- Patch renderGallery to update item count ---
const origRenderGallery = renderGallery;
renderGallery = function() {
    origRenderGallery();
    updateItemCount();
};

// --- Style for Top Bar (inject if not present) ---
(function injectTopBarStyle() {
    if (!document.getElementById('top-bar-style')) {
        const style = document.createElement('style');
        style.id = 'top-bar-style';
        style.textContent = `
        #top-bar {
            position: fixed;
            top: 0; left: 0; right: 0;
            z-index: 100;
        }
        .top-bar-overlay {
            background: linear-gradient(to bottom, rgba(0,0,0,0.7) 80%, rgba(0,0,0,0));
            color: #fff;
            padding: 18px 18px 10px 18px;
            display: flex;
            align-items: center;
            gap: 16px;
            font-size: 1.7rem;
            font-weight: 600;
        }
        .top-title { flex: 1; font-size: 1.5rem; font-weight: 700; letter-spacing: 0.5px; }
        .top-search { cursor: pointer; margin-right: 10px; }
        .top-count { font-size: 1rem; font-weight: 400; opacity: 0.9; }
        .gallery-container { margin-top: 70px !important; }
        `;
        document.head.appendChild(style);
    }
})();

// --- Call renderTopBar on load ---
renderTopBar();

function handleSwipe() {
    let touchstartX = 0;
    let touchendX = 0;

    galleryContainer.addEventListener('touchstart', function(event) {
        touchstartX = event.changedTouches[0].screenX;
    }, false);

    galleryContainer.addEventListener('touchend', function(event) {
        touchendX = event.changedTouches[0].screenX;
        handleGesture();
    }, false);

    function handleGesture() {
        if (touchendX < touchstartX - 50) {
            // Swipe left
            showingAlbums = true;
            renderGallery();
        }
        if (touchendX > touchstartX + 50) {
            // Swipe right
            showingAlbums = false;
            renderGallery();
        }
    }
}

// --- Profile Management Feature Start ---
let profiles = [
    {
        name: "Default",
        avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        locked: false,
        hidden: false,
        pin: "",
        albumsData: JSON.parse(JSON.stringify(albumsData)),
        galleryData: JSON.parse(JSON.stringify(galleryData)),
    }
];
let currentProfileIndex = 0;

function renderProfiles() {
    let profileBar = document.getElementById("profile-bar");
    if (!profileBar) {
        profileBar = document.createElement("div");
        profileBar.id = "profile-bar";
        profileBar.style.display = "flex";
        profileBar.style.gap = "10px";
        profileBar.style.alignItems = "center";
        profileBar.style.margin = "10px";
        document.body.insertBefore(profileBar, document.body.firstChild);
    }
    profileBar.innerHTML = "";
    profiles.forEach((profile, idx) => {
        if (profile.hidden) return;
        const div = document.createElement("div");
        div.className = "profile-avatar";
        div.title = profile.name + (profile.locked ? " (Locked)" : "");
        div.innerHTML = `<img src="${profile.avatar}" alt="${profile.name}" style="width:40px;height:40px;border-radius:50%;border:2px solid #ccc;" />`;
        if (profile.locked) div.classList.add("locked");
        if (idx === currentProfileIndex) div.classList.add("active");
        div.addEventListener("click", () => selectProfile(idx));
        profileBar.appendChild(div);
    });
    // Add button for new profile
    const addBtn = document.createElement("button");
    addBtn.textContent = "+";
    addBtn.className = "add-profile-btn";
    addBtn.onclick = showProfileCreateDialog;
    profileBar.appendChild(addBtn);
    // Add manage button
    let manageBtn = document.getElementById("manage-profiles-btn");
    if (!manageBtn) {
        manageBtn = document.createElement("button");
        manageBtn.id = "manage-profiles-btn";
        manageBtn.textContent = "Manage Profiles";
        manageBtn.style.marginLeft = "10px";
        manageBtn.onclick = showProfileManager;
        profileBar.appendChild(manageBtn);
    }
}

function selectProfile(idx) {
    const profile = profiles[idx];
    if (profile.locked) {
        const pin = prompt("Enter PIN to unlock profile:");
        if (pin !== profile.pin) {
            alert("Incorrect PIN");
            return;
        }
    }
    currentProfileIndex = idx;
    // Switch data
    albumsData.length = 0;
    profile.albumsData.forEach(a => albumsData.push(JSON.parse(JSON.stringify(a))));
    galleryData.length = 0;
    profile.galleryData.forEach(g => galleryData.push(JSON.parse(JSON.stringify(g))));
    renderGallery();
    renderProfiles();
}

function showProfileCreateDialog() {
    // If modal already exists, just show it
    let modal = document.getElementById('profile-create-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'profile-create-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(0,0,0,0.5)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '2000';
        modal.innerHTML = `
            <div style="background:#222;color:#fff;padding:28px 24px 18px 24px;border-radius:12px;min-width:320px;max-width:90vw;box-shadow:0 4px 24px #0008;position:relative;">
                <button id="close-profile-create-modal" style="position:absolute;top:8px;right:12px;background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer;">&times;</button>
                <h2 style="margin-top:0">Create Profile</h2>
                <form id="profile-create-form">
                    <div style="margin-bottom:12px;">
                        <label>Profile Name:<br><input type="text" id="profile-create-name" required style="width:100%;padding:6px;border-radius:4px;border:1px solid #444;background:#333;color:#fff;"></label>
                    </div>
                    <div style="margin-bottom:12px;">
                        <label>Avatar URL:<br><input type="url" id="profile-create-avatar" placeholder="(optional)" style="width:100%;padding:6px;border-radius:4px;border:1px solid #444;background:#333;color:#fff;"></label>
                    </div>
                    <div style="margin-bottom:12px;">
                        <label>PIN (4 digits, optional):<br><input type="password" id="profile-create-pin" pattern="\\d{4}" maxlength="4" inputmode="numeric" style="width:100%;padding:6px;border-radius:4px;border:1px solid #444;background:#333;color:#fff;"></label>
                    </div>
                    <div style="margin-bottom:16px;">
                        <label><input type="checkbox" id="profile-create-hide"> Hide this profile</label>
                    </div>
                    <button type="submit" style="background:#2196f3;color:#fff;padding:8px 20px;border:none;border-radius:4px;font-size:1rem;cursor:pointer;">Create</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        // Close modal logic
        document.getElementById('close-profile-create-modal').onclick = function() {
            modal.style.display = 'none';
        };
        // Form submit logic
        document.getElementById('profile-create-form').onsubmit = function(e) {
            e.preventDefault();
            const name = document.getElementById('profile-create-name').value.trim();
            const avatar = document.getElementById('profile-create-avatar').value.trim();
            const pin = document.getElementById('profile-create-pin').value.trim();
            const hide = document.getElementById('profile-create-hide').checked;
            if (!name) {
                alert('Profile name is required.');
                return;
            }
            if (pin && !/^\d{4}$/.test(pin)) {
                alert('PIN must be 4 digits.');
                return;
            }
            profiles.push({
                name,
                avatar: avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                locked: !!pin,
                hidden: hide,
                pin,
                albumsData: JSON.parse(JSON.stringify(albumsData)),
                galleryData: JSON.parse(JSON.stringify(galleryData)),
            });
            renderProfiles();
            modal.style.display = 'none';
        };
    } else {
        modal.style.display = 'flex';
    }
    // Reset form fields
    if (modal) {
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
}

function showProfileManager() {
    let msg = "Profiles:\n";
    profiles.forEach((p, i) => {
        msg += `${i + 1}. ${p.name}${p.locked ? ' (Locked)' : ''}${p.hidden ? ' (Hidden)' : ''}\n`;
    });
    msg += "\nEnter profile number to toggle hide/lock, or 0 to cancel:";
    const idx = parseInt(prompt(msg), 10) - 1;
    if (idx >= 0 && idx < profiles.length) {
        const p = profiles[idx];
        const action = prompt("Type 'hide' to toggle hide, 'lock' to toggle lock, or 'delete' to remove profile:");
        if (action === 'hide') {
            p.hidden = !p.hidden;
        } else if (action === 'lock') {
            if (!p.locked) {
                const pin = prompt("Set a 4-digit PIN:");
                if (pin && pin.length === 4) {
                    p.locked = true;
                    p.pin = pin;
                }
            } else {
                const pin = prompt("Enter current PIN to unlock:");
                if (pin === p.pin) {
                    p.locked = false;
                    p.pin = "";
                } else {
                    alert("Incorrect PIN");
                }
            }
        } else if (action === 'delete') {
            if (confirm("Are you sure you want to delete this profile?")) {
                profiles.splice(idx, 1);
                if (currentProfileIndex === idx) currentProfileIndex = 0;
            }
        }
        renderProfiles();
        selectProfile(currentProfileIndex);
    }
}

// Move item between profiles
function moveItemToProfile(item, fromProfileIdx, toProfileIdx, albumName) {
    if (fromProfileIdx === toProfileIdx) return;
    const fromProfile = profiles[fromProfileIdx];
    const toProfile = profiles[toProfileIdx];
    // Remove from source
    let removed = false;
    fromProfile.albumsData.forEach(album => {
        if (album.name === albumName) {
            const idx = album.items.findIndex(i => i.name === item.name && i.date === item.date);
            if (idx !== -1) {
                album.items.splice(idx, 1);
                removed = true;
            }
        }
    });
    if (removed) {
        // Add to destination
        let destAlbum = toProfile.albumsData.find(a => a.name === albumName);
        if (!destAlbum) {
            destAlbum = { name: albumName, cover: '', items: [] };
            toProfile.albumsData.push(destAlbum);
        }
        destAlbum.items.push(JSON.parse(JSON.stringify(item)));
        // Also update galleryData if needed
        if (albumName === 'Recents') {
            fromProfile.galleryData = fromProfile.galleryData.filter(i => !(i.name === item.name && i.date === item.date));
            toProfile.galleryData.push(JSON.parse(JSON.stringify(item)));
        }
    }
    // If current profile is affected, update UI
    if (currentProfileIndex === fromProfileIdx || currentProfileIndex === toProfileIdx) {
        albumsData.length = 0;
        profiles[currentProfileIndex].albumsData.forEach(a => albumsData.push(JSON.parse(JSON.stringify(a))));
        galleryData.length = 0;
        profiles[currentProfileIndex].galleryData.forEach(g => galleryData.push(JSON.parse(JSON.stringify(g))));
        renderGallery();
    }
}

// Add move option to gallery items
const origCreateGalleryItem = createGalleryItem;
createGalleryItem = function(item) {
    const div = origCreateGalleryItem(item);
    // Only show move if more than one profile
    if (profiles.length > 1) {
        const moveBtn = document.createElement('button');
        moveBtn.textContent = 'Move';
        moveBtn.className = 'move-profile-btn';
        moveBtn.onclick = (e) => {
            e.stopPropagation();
            let msg = 'Move to profile:\n';
            profiles.forEach((p, i) => {
                if (i !== currentProfileIndex && !p.hidden) msg += `${i + 1}. ${p.name}\n`;
            });
            const idx = parseInt(prompt(msg), 10) - 1;
            if (idx >= 0 && idx < profiles.length && idx !== currentProfileIndex && !profiles[idx].hidden) {
                // Find album name
                let albumName = 'Recents';
                if (currentAlbum) albumName = currentAlbum.name;
                moveItemToProfile(item, currentProfileIndex, idx, albumName);
            }
        };
        div.appendChild(moveBtn);
    }
    return div;
};

// --- Swipe Up/Down for Bottom Nav ---
(function() {
    const bottomNav = document.querySelector('.bottom-nav');
    let lastY = null;
    let isHidden = false;
    let threshold = 30; // Minimum px for swipe
    let startY = null;
    let lastTouchTime = 0;

    function showNav() {
        if (!isHidden) return;
        bottomNav.classList.remove('hide-down');
        bottomNav.classList.add('show-up');
        isHidden = false;
    }
    function hideNav() {
        if (isHidden) return;
        bottomNav.classList.remove('show-up');
        bottomNav.classList.add('hide-down');
        isHidden = true;
    }

    // Touch events
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length !== 1) return;
        startY = e.touches[0].clientY;
        lastTouchTime = Date.now();
    });
    document.addEventListener('touchmove', function(e) {
        if (startY === null) return;
        let deltaY = e.touches[0].clientY - startY;
        if (deltaY > threshold) {
            hideNav();
            startY = null;
        } else if (deltaY < -10) {
            showNav();
            startY = null;
        }
    });
    document.addEventListener('touchend', function() {
        startY = null;
    });

    // Mouse wheel (for desktop)
    let lastScroll = 0;
    window.addEventListener('wheel', function(e) {
        if (Math.abs(e.deltaY) < 5) return;
        if (e.deltaY > 0) {
            hideNav();
        } else {
            showNav();
        }
    }, {passive:true});

    // Mouse drag (for desktop)
    let mouseDown = false;
    let mouseStartY = null;
    document.addEventListener('mousedown', function(e) {
        mouseDown = true;
        mouseStartY = e.clientY;
    });
    document.addEventListener('mousemove', function(e) {
        if (!mouseDown || mouseStartY === null) return;
        let deltaY = e.clientY - mouseStartY;
        if (deltaY > threshold) {
            hideNav();
            mouseDown = false;
            mouseStartY = null;
        } else if (deltaY < -10) {
            showNav();
            mouseDown = false;
            mouseStartY = null;
        }
    });
    document.addEventListener('mouseup', function() {
        mouseDown = false;
        mouseStartY = null;
    });

    // Always show nav on page load
    showNav();
})();

renderProfiles();
renderGallery();
handleSwipe();
// --- Profile Management Feature End ---

// --- Multi-Select State ---
let selectedImages = [];

function isImageFile(item) {
    const ext = getFileExtension(item.name);
    return ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext);
}

// Patch createGalleryItem to support selection
const origCreateGalleryItemMulti = createGalleryItem;
createGalleryItem = function(item) {
    const div = origCreateGalleryItemMulti(item);
    if (isImageFile(item)) {
        div.classList.add('selectable-image');
        div.onclick = function(e) {
            if (e.ctrlKey || e.metaKey) {
                // Toggle selection
                const idx = selectedImages.findIndex(i => i.name === item.name && i.date === item.date);
                if (idx === -1) {
                    selectedImages.push(item);
                    div.classList.add('selected');
                } else {
                    selectedImages.splice(idx, 1);
                    div.classList.remove('selected');
                }
                updateMultiSelectToolbar();
                e.stopPropagation();
                return;
            } else if (selectedImages.length > 0) {
                // If already selecting, clear selection and open preview
                clearMultiSelect();
                openPreview(item);
                return;
            } else {
                openPreview(item);
            }
        };
    }
    return div;
};

function clearMultiSelect() {
    selectedImages = [];
    document.querySelectorAll('.gallery-item.selected').forEach(el => el.classList.remove('selected'));
    updateMultiSelectToolbar();
}

// Multi-select toolbar
function updateMultiSelectToolbar() {
    let toolbar = document.getElementById('multi-select-toolbar');
    if (selectedImages.length > 1) {
        if (!toolbar) {
            toolbar = document.createElement('div');
            toolbar.id = 'multi-select-toolbar';
            toolbar.style.position = 'fixed';
            toolbar.style.bottom = '60px';
            toolbar.style.left = '50%';
            toolbar.style.transform = 'translateX(-50%)';
            toolbar.style.background = '#222';
            toolbar.style.color = '#fff';
            toolbar.style.borderRadius = '10px';
            toolbar.style.boxShadow = '0 2px 12px #000a';
            toolbar.style.display = 'flex';
            toolbar.style.gap = '16px';
            toolbar.style.padding = '10px 24px';
            toolbar.style.zIndex = '2001';
            document.body.appendChild(toolbar);
        }
        toolbar.innerHTML = `
            <button id="multi-share-btn">Share</button>
            <button id="multi-create-btn">Create</button>
            <button id="multi-delete-btn">Delete</button>
            <div style="position:relative;display:inline-block;">
                <button id="multi-more-btn">More &#x25BC;</button>
                <div id="multi-more-menu" style="display:none;position:absolute;left:0;top:110%;background:#222;border-radius:8px;box-shadow:0 2px 12px #000a;padding:8px 0;z-index:10;min-width:180px;">
                    <button class="multi-more-item" id="multi-move-album-btn" style="width:100%;text-align:left;padding:8px 18px;background:none;border:none;color:#fff;">Move to Album</button>
                    <button class="multi-more-item" id="multi-convert-pdf-btn" style="width:100%;text-align:left;padding:8px 18px;background:none;border:none;color:#fff;">Convert into PDF</button>
                </div>
            </div>
            <button id="multi-cancel-btn" style="margin-left:12px;">Cancel</button>
        `;
        // Button logic
        document.getElementById('multi-share-btn').onclick = function() {
            if (navigator.share) {
                navigator.share({
                    title: 'Selected Images',
                    files: [], // Not all browsers support File sharing
                    text: selectedImages.map(i => i.name).join(', '),
                    url: selectedImages[0].src
                });
            } else {
                prompt('Copy image URLs:', selectedImages.map(i => i.src).join('\n'));
            }
        };
        document.getElementById('multi-create-btn').onclick = function() {
            alert('Create feature not implemented.');
        };
        document.getElementById('multi-delete-btn').onclick = function() {
            if (confirm('Delete selected images?')) {
                selectedImages.forEach(item => {
                    let idx = galleryData.findIndex(i => i.name === item.name && i.date === item.date);
                    if (idx !== -1) galleryData.splice(idx, 1);
                    if (currentAlbum && currentAlbum.items) {
                        let aidx = currentAlbum.items.findIndex(i => i.name === item.name && i.date === item.date);
                        if (aidx !== -1) currentAlbum.items.splice(aidx, 1);
                    }
                });
                clearMultiSelect();
                renderGallery();
            }
        };
        // More menu logic
        const moreBtn = document.getElementById('multi-more-btn');
        const moreMenu = document.getElementById('multi-more-menu');
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
        document.getElementById('multi-move-album-btn').onclick = function() {
            let albumNames = albumsData.filter(a => a.name !== 'Recents' && a.name !== 'Images' && a.name !== 'Videos' && a.name !== 'Documents').map(a => a.name);
            let msg = 'Move to album:\n' + albumNames.map((n, i) => `${i + 1}. ${n}`).join('\n');
            let idx = parseInt(prompt(msg), 10) - 1;
            if (idx >= 0 && idx < albumNames.length) {
                let album = albumsData.find(a => a.name === albumNames[idx]);
                if (album) {
                    selectedImages.forEach(item => {
                        album.items.push(item);
                        if (currentAlbum && currentAlbum.items) {
                            let aidx = currentAlbum.items.findIndex(i => i.name === item.name && i.date === item.date);
                            if (aidx !== -1) currentAlbum.items.splice(aidx, 1);
                        }
                    });
                    clearMultiSelect();
                    renderGallery();
                }
            }
        };
        document.getElementById('multi-convert-pdf-btn').onclick = function() {
            alert('Convert to PDF feature not implemented.');
        };
        document.getElementById('multi-cancel-btn').onclick = function() {
            clearMultiSelect();
        };
        toolbar.style.display = 'flex';
    } else if (toolbar) {
        toolbar.style.display = 'none';
    }
}

// --- Swipe selection for multi-select mode ---
(function enableSwipeSelection() {
    let isSelecting = false;
    let lastTarget = null;
    let selectMode = false;

    // Touch events
    galleryContainer.addEventListener('touchstart', function(e) {
        if (selectedImages.length > 0 && e.touches.length === 1) {
            isSelecting = true;
            lastTarget = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
            selectGalleryItemByElement(lastTarget);
        }
    }, {passive: true});
    galleryContainer.addEventListener('touchmove', function(e) {
        if (isSelecting && e.touches.length === 1) {
            const el = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
            if (el && el !== lastTarget && el.classList.contains('gallery-item')) {
                selectGalleryItemByElement(el);
                lastTarget = el;
            }
        }
    }, {passive: true});
    galleryContainer.addEventListener('touchend', function() {
        isSelecting = false;
        lastTarget = null;
    });

    // Mouse drag events
    let mouseSelecting = false;
    galleryContainer.addEventListener('mousedown', function(e) {
        if (selectedImages.length > 0 && e.button === 0) {
            mouseSelecting = true;
            lastTarget = document.elementFromPoint(e.clientX, e.clientY);
            selectGalleryItemByElement(lastTarget);
        }
    });
    galleryContainer.addEventListener('mousemove', function(e) {
        if (mouseSelecting) {
            const el = document.elementFromPoint(e.clientX, e.clientY);
            if (el && el !== lastTarget && el.classList.contains('gallery-item')) {
                selectGalleryItemByElement(el);
                lastTarget = el;
            }
        }
    });
    document.addEventListener('mouseup', function() {
        mouseSelecting = false;
        lastTarget = null;
    });

    function selectGalleryItemByElement(el) {
        if (!el || !el.classList.contains('gallery-item')) return;
        const name = el.dataset.name;
        const item = galleryData.find(i => i.name === name);
        if (!item || !isImageFile(item)) return;
        const idx = selectedImages.findIndex(i => i.name === item.name && i.date === item.date);
        if (idx === -1) {
            selectedImages.push(item);
            el.classList.add('selected');
        }
        updateMultiSelectToolbar();
    }
})();
