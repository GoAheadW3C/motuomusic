import {mapGetters} from 'vuex'

export const playlistMinxin={
	computed:{
		...mapGetters([
			'playlist'
		])
	},
	mounted(){
		this.handlePlaylist(this.playlist);
	},
	activated(){
		this.handlePlaylist(this.playlist);
	},
	watch:{
		playlist(newVal){
			this.handlePlaylist(newVal);
		}
	},
	methods:{
		handlePlaylist(){
			throw new Error('component must implement handlePlaylist medthod');
		}
	}

}