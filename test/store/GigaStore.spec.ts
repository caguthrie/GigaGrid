import * as Flux from 'flux';
import Dispatcher = Flux.Dispatcher;
import {GigaAction} from "../../src/store/GigaStore";
import {GigaStore} from "../../src/store/GigaStore";
import {GigaProps} from "../../src/components/GigaGrid";
import {TestUtils} from "../TestUtils";
import {NewSubtotalAction} from "../../src/store/GigaStore";
import {GigaActionType} from "../../src/store/GigaStore";
import {ClearSubtotalAction} from "../../src/store/GigaStore";
import {ToggleCollapseAction} from "../../src/store/GigaStore";
import {NewSortAction} from "../../src/store/GigaStore";
import {ColumnFormat} from "../../src/models/ColumnLike";
import {AddSortAction} from "../../src/store/GigaStore";
import {ClearSortAction} from "../../src/store/GigaStore";
import {SortDirection} from "../../src/models/ColumnLike";

describe("GigaStore", ()=> {

    var dispatcher:Dispatcher<GigaAction>;
    var store:GigaStore;
    var props:GigaProps;

    beforeEach(()=> {
        dispatcher = new Dispatcher<GigaAction>();
        const people = TestUtils.newPeopleTestData();
        props = {
            data: people.rawData(),
            columnDefs: people.columnDefs()
        };
        store = new GigaStore(dispatcher, props);
    });

    it("can deduce the correct initial state", ()=> {
        const initialState = store.getInitialState();
        expect(initialState).toBeTruthy();
        expect(initialState.subtotalBys).toEqual([]);
        const state = store.getState();
        expect(state).toEqual(initialState);
        expect(state.tree.getRoot().getChildren().length).toBe(0);
        expect(state.tree.getRoot().detailRows.length).toBe(10);
    });

    describe("can handle Subtotal Actions", ()=> {

        var newSubtotalAction:NewSubtotalAction = {
            type: GigaActionType.NEW_SUBTOTAL,
            subtotalBys: [{colTag: "gender"}]
        };

        it("can handle NEW_SUBTOTAL action", ()=> {
            var state = store.getState();
            expect(state.rasterizedRows.length).toBe(10);

            dispatcher.dispatch(newSubtotalAction);
            state = store.getState();
            expect(state.subtotalBys.length).toBe(1);
            expect(state.subtotalBys[0]).toBe(newSubtotalAction.subtotalBys[0]);
            const children = state.tree.getRoot().getChildren();
            expect(children.length).toBe(2);
            expect(state.tree.getRoot().getChildByTitle("Male")).toBeDefined();
            expect(state.tree.getRoot().getChildByTitle("Male")).not.toBeNull();
            expect(state.rasterizedRows.length).toBe(12);
        });

        it("can handle CLEAR_SUBTOTAL action", ()=> {
            dispatcher.dispatch(newSubtotalAction);
            var state = store.getState();
            expect(state.subtotalBys[0]).toBe(newSubtotalAction.subtotalBys[0]);
            expect(state.rasterizedRows.length).toBe(12);

            // clear subtotal
            dispatcher.dispatch({type: GigaActionType.CLEAR_SUBTOTAL});
            state = store.getState();
            expect(state.subtotalBys).toEqual([]);
            expect(state.rasterizedRows.length).toBe(10);
            expect(state.tree.getRoot().getChildren.length).toBe(0);
        });

        it("can handle TOGGLE_ROW_COLLAPSE action", ()=> {


            dispatcher.dispatch(newSubtotalAction);
            expect(store.getState().rasterizedRows.length).toBe(12);

            const row = store.getState().tree.getRoot().getChildByTitle("Male");
            const toggleRowCollapse:ToggleCollapseAction = {
                type: GigaActionType.TOGGLE_ROW_COLLAPSE,
                subtotalRow: row
            };

            expect(row.isCollapsed()).toBeFalsy();

            dispatcher.dispatch(toggleRowCollapse);
            expect(store.getState().rasterizedRows.length).toBe(7);
            expect(row.isCollapsed()).toBeTruthy();

            dispatcher.dispatch(toggleRowCollapse);
            expect(store.getState().rasterizedRows.length).toBe(12);
            expect(row.isCollapsed()).toBeFalsy();

        });

    });

    describe("can handle Sort Actions", ()=> {

        const sortByGender = {
            colTag: "gender",
            direction: SortDirection.ASC,
            format: ColumnFormat.STRING
        };

        const sortByGift = {
            colTag: "gift",
            direction: SortDirection.DESC,
            format: ColumnFormat.NUMBER
        };

        it("can handle NEW_SORT action", ()=> {

            const action:NewSortAction = {
                type: GigaActionType.NEW_SORT,
                sortBys: [sortByGift]
            };

            var root = store.getState().tree.getRoot();
            dispatcher.dispatch(action);
            expect(store.getState().rasterizedRows[0].getByColTag('gift')).toBe(10);
            expect(root.detailRows[0].getByColTag('gift')).toBe(10);
            expect(root.detailRows[root.detailRows.length - 1].getByColTag('gift')).toBe(2);
            expect(store.getState().sortBys.length).toBe(1);

        });

        it("can handle ADD_SORT action", ()=> {
            // start with a gender sort
            const firstSort:NewSortAction = {
                type: GigaActionType.NEW_SORT,
                sortBys: [sortByGender]
            };

            dispatcher.dispatch(firstSort);
            var root = store.getState().tree.getRoot();
            expect(root.detailRows[0].getByColTag('gender')).toBe("Female");
            expect(store.getState().rasterizedRows[0].getByColTag('gender')).toBe("Female");

            // add a sort
            const action:AddSortAction = {
                type: GigaActionType.ADD_SORT,
                sortBy: sortByGift
            };

            dispatcher.dispatch(action);

            expect(root.detailRows[0].getByColTag('gender')).toBe("Female");
            expect(root.detailRows[0].getByColTag('gift')).toBe(10);

            expect(store.getState().sortBys.length).toBe(2);
        });

        it("can handle CLEAR_SORT action", ()=> {
            // start with a gender sort
            const firstSort:NewSortAction = {
                type: GigaActionType.NEW_SORT,
                sortBys: [sortByGender]
            };

            dispatcher.dispatch(firstSort);

            // simulate clear sort
            const action:ClearSortAction = {
                type: GigaActionType.CLEAR_SORT
            };

            dispatcher.dispatch(action);
            expect(store.getState().sortBys.length).toBe(0);

        });

    });

    // TODO write more tests
});