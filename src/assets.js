export default {
    'audio': {
        auraBlazing: {
            key: 'auraBlazing',
            args: ['assets/audio/auraBlazing.mp3']
        },
        auraFaded: {
            key: 'auraFaded',
            args: ['assets/audio/auraFaded.mp3']
        },
        theme: {
            key: 'theme',
            args: ['assets/audio/theme.mp3']
        }
    },
    'image': {
        spark: {
            key: 'spark',
            args: ['assets/image/spark.png']
        },
    },
    'spritesheet': {
        tiles: {
            key: 'tiles',
            args: ['assets/spritesheet/tiles.png', {
                frameWidth: 32,
                frameHeight: 32
            }]
        },
        characters: {
            key: 'characters',
            args: ['assets/spritesheet/characters.png', {
                frameWidth: 32,
                frameHeight: 32
            }]
        },
    },
    'tilemapTiledJSON': {
        map: {
            key: 'map',
            args: ['assets/tilemap.json']
        },
    }
};